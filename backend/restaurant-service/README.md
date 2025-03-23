# Restaurant Service

This service manages restaurants and their menus in the Cloud-Native Food Ordering & Delivery System.

## Features

- Restaurant management (create, update, delete)
- Menu management (add, update, delete items)
- Location-based restaurant search
- Rating and review system
- Order management integration
- Role-based access control

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Docker (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/food-ordering-restaurants
SECRET=your_jwt_secret_key_here
ORDER_SERVICE_URL=http://order-service:3002
```

## Installation

1. Clone the repository
2. Navigate to the restaurant service directory:
   ```bash
   cd backend/restaurant-service
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
docker build -t restaurant-service .
docker run -p 3001:3001 restaurant-service
```

## API Endpoints

### Restaurants

- `GET /api/restaurants` - Get all restaurants (with optional filters)
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create a new restaurant (Seller only)
- `PATCH /api/restaurants/:id` - Update restaurant details (Seller only)
- `DELETE /api/restaurants/:id` - Delete restaurant (Admin only)

### Menu Items

- `POST /api/restaurants/:id/menu` - Add menu item (Seller only)
- `PATCH /api/restaurants/:id/menu/:menuItemId` - Update menu item (Seller only)
- `DELETE /api/restaurants/:id/menu/:menuItemId` - Delete menu item (Seller only)

### Orders

- `GET /api/restaurants/:id/orders` - Get restaurant orders (Seller only)

### Ratings

- `POST /api/restaurants/:id/rating` - Update restaurant rating (Authenticated users)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access Control

- **Public**: View restaurants and menu items
- **Seller**: Manage their own restaurants and menus
- **Admin**: Manage all restaurants
- **Authenticated Users**: Rate restaurants

## Error Handling

The service includes comprehensive error handling for:

- Invalid requests
- Authentication failures
- Database errors
- Role-based access violations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
