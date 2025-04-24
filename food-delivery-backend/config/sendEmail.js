const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const msg = {
    to: options.email,
    from: {
      email: process.env.FROM_EMAIL,
      name: process.env.FROM_NAME,
    },
    subject: options.subject,
    text: options.message,
    html: `<p>${options.message}</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = sendEmail;
