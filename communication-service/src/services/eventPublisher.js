const amqp = require("amqplib");
const { logger } = require("../utils/logger");

class EventPublisher {
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
      logger.info("Connected to RabbitMQ");
    } catch (error) {
      logger.error("Failed to connect to RabbitMQ:", error);
      throw error;
    }
  }

  async publish(eventType, payload) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const message = Buffer.from(JSON.stringify(payload));
      this.channel.publish("food-delivery", eventType, message, {
        persistent: true,
      });
      logger.info(`Published event: ${eventType}`);
    } catch (error) {
      logger.error(`Failed to publish event ${eventType}:`, error);
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

const eventPublisher = new EventPublisher();

const initializeEventPublisher = async () => {
  try {
    await eventPublisher.connect();
  } catch (error) {
    logger.error("Failed to initialize event publisher:", error);
    process.exit(1);
  }
};

module.exports = {
  eventPublisher,
  initializeEventPublisher,
};
