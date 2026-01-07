# NestJS PostgreSQL Project

A robust backend API built with NestJS, TypeORM, and PostgreSQL, featuring user authentication, role-based access control, and product management.

## Features

- **Authentication & Authorization**: JWT-based auth with role guards (Admin, Staff)
- **User Management**: Admin entity with sessions, OTP verification, and soft deletes
- **Product Management**: CRUD operations for products with pricing and status
- **Database Migrations**: TypeORM-powered schema migrations for version control
- **Environment Configuration**: Secure config management with environment variables
- **Error Handling**: Centralized error services and handlers
- **Validation**: DTOs for request/response validation

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Config**: @nestjs/config
- **Validation**: class-validator, class-transformer
- **Testing**: Jest
- **Linting**: ESLint

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- Docker (optional, for database setup)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nest-postgre
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env` (if available) or create `.env` with the following:
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=yourpassword
     DB_NAME=learningPostgres
     JWT_ACCESS_SECRET=your-jwt-secret
     JWT_ACCESS_TEMP_SECRET=your-temp-jwt-secret
     JWT_ACCESS_TEMP_EXPIRY=10m
     ACCESS_KEY=your-access-key
     FETCH_COUNTRY_API=https://apiip.net/api/check?ip=
     ```

4. **Set up PostgreSQL database**:
   - Ensure PostgreSQL is running.
   - Create a database named `learningPostgres` or update `DB_NAME` accordingly.

## Database Setup

This project uses TypeORM migrations for schema management.

1. **Run migrations**:
   ```bash
   npm run migration:run
   ```

2. **Generate new migrations** (after entity changes):
   ```bash
   npm run migration:generate -- src/db/migrations/MigrationName
   ```

3. **Revert migrations** (if needed):
   ```bash
   npm run migration:revert
   ```

## Running the Application

### Development
```bash
npm run start:dev
```
The app will start on `http://localhost:3000` (or your configured PORT).

### Production
```bash
npm run build
npm run start:prod
```

### Debugging
```bash
npm run start:debug
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/temp-login` - Temporary login

### Admin
- `GET /admin` - List admins
- `POST /admin` - Create admin
- `GET /admin/:id` - Get admin by ID
- `PUT /admin/:id` - Update admin
- `DELETE /admin/:id` - Delete admin

### Products
- `GET /product` - List products
- `POST /product` - Create product
- `GET /product/:id` - Get product by ID
- `PUT /product/:id` - Update product
- `DELETE /product/:id` - Delete product

*Note: Most endpoints require authentication and appropriate roles.*

## Scripts

- `npm run start` - Start production build
- `npm run start:dev` - Start in watch mode
- `npm run start:debug` - Start with debugger
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run lint` - Lint the code
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

## Project Structure

```
src/
├── admin/          # Admin module (entities, controllers, services)
├── auth/           # Authentication module (strategies, guards, decorators)
├── common/         # Shared utilities and interfaces
├── db/             # Database migrations
├── error-handler/  # Error handling services
├── product/        # Product module
├── app.controller.ts
├── app.module.ts   # Root module
├── app.service.ts
├── data-source.ts  # TypeORM CLI config
└── main.ts         # Application entry point
```

## Testing

```bash
npm run test
```

For e2e tests:
```bash
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.