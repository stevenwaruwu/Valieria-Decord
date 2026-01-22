# Valieria Decord - E-commerce Platform

## Overview

Valieria Decord is a premium interior design e-commerce platform specializing in wallpapers, rugs, and wall panels. The application is built as a full-stack TypeScript project with a React frontend and Express backend, targeting the Indonesian market with Indonesian language (Bahasa Indonesia) throughout the UI.

The platform provides:
- Product catalog with filtering by type, room category, and color
- Shopping cart functionality (stored in localStorage)
- Multi-step checkout process with shipping integration
- User authentication with session management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and UI animations
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for Replit environment

The frontend follows a pages-based structure under `client/src/pages/` with shared components in `client/src/components/`. Custom hooks in `client/src/hooks/` handle data fetching and state logic.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: MySQL with Drizzle ORM (configured via environment variables)
- **Session Management**: express-session with MySQL session store
- **Authentication**: Passport.js with local strategy (username/password)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe contracts

The backend uses a storage pattern (`server/storage.ts`) to abstract database operations, making it easier to test and modify data access logic.

### Shared Code
- **Location**: `shared/` directory
- **Schema**: Drizzle ORM table definitions in `shared/schema.ts`
- **API Contracts**: Route definitions with input/output Zod schemas in `shared/routes.ts`
- **Auth Models**: User and session models in `shared/models/auth.ts`

### Database Design
- Uses MySQL (configured via DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT environment variables)
- Alternative PostgreSQL config exists in `drizzle.config.ts` (uses DATABASE_URL)
- Tables: products, product_variants, orders, order_items, users, sessions
- Drizzle ORM handles schema definitions and migrations

### Authentication Flow
- Custom username/password authentication (not Replit Auth)
- Passwords hashed with bcryptjs
- Sessions stored in MySQL using express-mysql-session
- Protected routes check `req.isAuthenticated()` before processing

### Build System
- Development: `tsx` for running TypeScript directly
- Production: Custom build script using esbuild for server and Vite for client
- Output: Combined bundle in `dist/` directory

## External Dependencies

### Database
- **MySQL**: Primary database (connection via environment variables)
- **Drizzle ORM**: Type-safe database queries and migrations

### UI Libraries
- **shadcn/ui**: Pre-built accessible components (Radix UI primitives)
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations
- **Lucide React**: Icon library

### Server Dependencies
- **express-session**: Session management
- **express-mysql-session**: MySQL session store
- **passport / passport-local**: Authentication
- **bcryptjs**: Password hashing
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Frontend bundler with HMR
- **esbuild**: Server bundling for production
- **drizzle-kit**: Database migrations

### Environment Variables Required
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`: MySQL connection
- `SESSION_SECRET`: Session encryption key
- `DATABASE_URL`: Alternative PostgreSQL connection (if using Postgres)