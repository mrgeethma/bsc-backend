# BSC Organics - E-commerce Backend

A NestJS-based backend API for selling spices and related organic products.

## Tech Stack

- **Backend**: NestJS (Express), PostgreSQL, TypeORM
- **Logging**: Pino
- **Config**: process.env + Joi validation
- **Validation**: class-validator
- **Error handling**: Global Exception Filter
- **Auth**: JWT authentication
- **Architecture**: Controller → Service → Repository pattern

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your database and other settings in .env

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

### API Documentation

Once the server is running, you can access the Swagger API documentation at:
`http://localhost:3001/api`

### Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run start:prod` - Start production server
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations

## Project Structure

```
src/
├── common/           # Shared utilities, filters, guards
├── config/          # Configuration modules
├── auth/            # Authentication module
├── users/           # User management
├── products/        # Product catalog
├── categories/      # Product categories
├── orders/          # Order management
├── payments/        # Payment processing
├── blog/            # Blog/recipes section
└── admin/           # Admin panel endpoints
```

## Features

- ✅ Health check endpoints
- 🔄 JWT Authentication
- 🔄 Product catalog with variants
- 🔄 Order management
- 🔄 PayHere payment integration
- 🔄 Invoice PDF generation
- 🔄 Email notifications
- 🔄 Blog/recipes section
- 🔄 Admin panel

## License

Private - All rights reserved