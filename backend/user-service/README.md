# User Service

This service handles user management and authentication for the Cloud-Native Food Ordering & Delivery System.

## Features

- User registration and authentication
- Email verification
- Password reset functionality
- Profile management
- Role-based access control
- Location-based user search
- Admin user management

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Docker (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/food-ordering-users
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
NOTIFICATION_SERVICE_URL=http://notification-service:3004
```

## Installation

1. Clone the repository
2. Navigate to the user service directory:
   ```bash
   cd backend/user-service
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
docker build -t user-service .
docker run -p 3000:3000 user-service
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/logout` - Logout user
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password
- `GET /api/users/verify-email/:token` - Verify email

### User Profile

- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

### Admin Routes

- `GET /api/users/users` - Get all users (Admin only)
- `PATCH /api/users/users/:id/status` - Update user status (Admin only)

## Authentication

Most endpoints require authentication. The service uses JWT tokens stored in HTTP-only cookies for security.

## Role-Based Access Control

- **Customer**: Basic user functionality
- **Seller**: Restaurant management
- **Admin**: System-wide management
- **Delivery Personnel**: Order delivery management

## Error Handling

The service includes comprehensive error handling for:

- Invalid requests
- Authentication failures
- Database errors
- Role-based access violations
- Email verification failures
- Password reset issues

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
