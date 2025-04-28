# Delivery Service

A microservice for handling food delivery operations in a cloud-native food ordering system.

## Features

- Delivery tracking and management
- Real-time location updates
- Status management
- Integration with order service
- Secure authentication and authorization
- Rate limiting and security measures

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3005
MONGODB_URI=mongodb://localhost:27017/delivery-service
JWT_SECRET=your_jwt_secret
ORDER_SERVICE_URL=http://localhost:3003
CORS_ORIGIN=http://localhost:3000
```

For testing, create a `.env.test` file:

```env
PORT=3005
MONGODB_URI_TEST=mongodb://localhost:27017/delivery-service-test
JWT_SECRET=test_jwt_secret
TEST_TOKEN=your_test_jwt_token
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the service:
   ```bash
   npm start
   ```

For development:

```bash
npm run dev
```

## API Documentation

### Authentication

All endpoints require authentication using JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### GET /api/v1/deliveries

Get all deliveries

#### GET /api/v1/deliveries/:id

Get a specific delivery

#### PUT /api/v1/deliveries/:id/status

Update delivery status

- Body: `{ "status": "assigned" | "picked_up" | "in_transit" | "delivered" | "failed" }`

#### PUT /api/v1/deliveries/:id/location

Update delivery location

- Body: `{ "coordinates": [longitude, latitude] }`

#### PUT /api/v1/deliveries/:id/accept

Accept a delivery

- Body: `{ "deliveryPersonId": "string" }`

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Security

The service implements several security measures:

- JWT authentication
- Rate limiting
- CORS protection
- Input sanitization
- XSS protection
- Helmet security headers

## Docker

Build the Docker image:

```bash
docker build -t delivery-service .
```

Run the container:

```bash
docker run -p 3005:3005 delivery-service
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
