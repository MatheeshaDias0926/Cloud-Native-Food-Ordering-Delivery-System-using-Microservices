const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { initializeEventPublisher } = require("./services/eventPublisher");
const { initializeEventConsumer } = require("./services/eventConsumer");
const { setupRoutes } = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize event-based communication
initializeEventPublisher();
initializeEventConsumer();

// Setup routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Communication service running on port ${PORT}`);
});
