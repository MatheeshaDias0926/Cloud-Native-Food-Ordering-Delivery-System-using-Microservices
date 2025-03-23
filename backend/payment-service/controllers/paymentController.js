const Payment = require("../models/Payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, orderId, restaurantId } = req.body;

    // Create a payment record
    const payment = new Payment({
      orderId,
      userId: req.userId,
      restaurantId,
      amount,
      currency,
      paymentMethod: "card",
    });

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      metadata: {
        orderId: orderId.toString(),
        userId: req.userId.toString(),
      },
    });

    payment.stripePaymentIntentId = paymentIntent.id;
    await payment.save();

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      payment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating payment intent" });
  }
};

// Handle Stripe webhook
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Handle successful payment
const handleSuccessfulPayment = async (paymentIntent) => {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!payment) return;

    payment.status = "completed";
    await payment.save();

    // Update order payment status
    await axios.patch(
      `${process.env.ORDER_SERVICE_URL}/api/orders/${payment.orderId}/payment`,
      {
        paymentStatus: "paid",
      }
    );

    // Notify user
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      {
        userId: payment.userId,
        type: "payment_success",
        orderId: payment.orderId,
        message: "Your payment has been processed successfully",
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// Handle failed payment
const handleFailedPayment = async (paymentIntent) => {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!payment) return;

    payment.status = "failed";
    await payment.save();

    // Update order payment status
    await axios.patch(
      `${process.env.ORDER_SERVICE_URL}/api/orders/${payment.orderId}/payment`,
      {
        paymentStatus: "failed",
      }
    );

    // Notify user
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      {
        userId: payment.userId,
        type: "payment_failed",
        orderId: payment.orderId,
        message: "Your payment has failed. Please try again.",
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// Process refund
const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      reason: reason || "requested_by_customer",
    });

    payment.status = "refunded";
    payment.refundId = refund.id;
    payment.refundReason = reason;
    await payment.save();

    // Notify user
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      {
        userId: payment.userId,
        type: "payment_refunded",
        orderId: payment.orderId,
        message: "Your payment has been refunded",
      }
    );

    res.status(200).json({ message: "Refund processed successfully", payment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error processing refund" });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ payment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching payment" });
  }
};

// Get user's payments
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .populate("orderId")
      .populate("restaurantId", "name");
    res.status(200).json({ payments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

module.exports = {
  createPaymentIntent,
  handleStripeWebhook,
  processRefund,
  getPaymentById,
  getUserPayments,
};
