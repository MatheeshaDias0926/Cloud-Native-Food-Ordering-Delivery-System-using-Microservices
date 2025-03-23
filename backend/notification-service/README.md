# Notification Service

This service handles email and SMS notifications for the Cloud-Native Food Ordering & Delivery System.

## Features

- Email notifications using Nodemailer
- SMS notifications using Twilio
- Notification management (create, read, delete)
- User-specific notification retrieval
- Order and delivery status updates

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Twilio Account (for SMS notifications)
- SMTP Server (for email notifications)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3004
MONGODB_URI=mongodb://localhost:27017/food-ordering-notification
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Installation

1. Clone the repository
2. Navigate to the notification service directory:
   ```bash
   cd backend/notification-service
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Service

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Using Docker

```bash
docker build -t notification-service .
docker run -p 3004:3004 notification-service
```

## API Endpoints

### Notifications

- `POST /api/notifications` - Create a new notification
- `GET /api/notifications` - Get user's notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete a notification

## Authentication

All endpoints except notification creation require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The service includes comprehensive error handling for:

- Invalid requests
- Authentication failures
- Database errors
- Email/SMS sending failures

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
