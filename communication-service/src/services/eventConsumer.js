const amqp = require("amqplib");
const { logger } = require("../utils/logger");
const { handleEvent } = require("./eventHandler");

class EventConsumer {
  constructor() {
    this.channel = null;
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange("food-delivery", "topic", {
        durable: true,
      });
      logger.info("Consumer connected to RabbitMQ");
    } catch (error) {
      logger.error("Failed to connect consumer to RabbitMQ:", error);
      throw error;
    }
  }

  async startConsuming() {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const queue = await this.channel.assertQueue("", { exclusive: true });

      // Bind to all event types
      await this.channel.bindQueue(queue.queue, "food-delivery", "#");

      this.channel.consume(queue.queue, async (msg) => {
        if (msg !== null) {
          try {
            const eventType = msg.fields.routingKey;
            const payload = JSON.parse(msg.content.toString());

            logger.info(`Received event: ${eventType}`);
            await handleEvent(eventType, payload);

            this.channel.ack(msg);
          } catch (error) {
            logger.error("Error processing message:", error);
            // Reject the message and requeue
            this.channel.nack(msg, false, true);
          }
        }
      });

      logger.info("Started consuming events");
    } catch (error) {
      logger.error("Failed to start consuming:", error);
      throw error;
    }
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

const eventConsumer = new EventConsumer();

const initializeEventConsumer = async () => {
  try {
    await eventConsumer.startConsuming();
  } catch (error) {
    logger.error("Failed to initialize event consumer:", error);
    process.exit(1);
  }
};

module.exports = {
  eventConsumer,
  initializeEventConsumer,
};
