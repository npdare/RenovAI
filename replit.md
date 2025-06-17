# HomeVision - Premium AI-Powered Interior Design Platform

## Overview

HomeVision is a sophisticated full-stack web application targeting interior designers, architects, and design-conscious homeowners. The platform provides AI-powered room visualization, premium design inspiration, curated product marketplace, and comprehensive monetization features including freemium subscriptions and affiliate commerce.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and production builds
- **File Uploads**: React Dropzone for drag-and-drop file handling

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **File Handling**: Multer for multipart file uploads
- **Development**: tsx for TypeScript execution in development

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (Neon serverless in production)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: @neondatabase/serverless for serverless PostgreSQL connections

## Key Components

### Data Models
- **Users**: Authentication and user management
- **Photos**: File storage with metadata (type, category, upload timestamps)
- **Design Boards**: Collections of photos for inspiration and planning
- **Board Photos**: Many-to-many relationship between boards and photos
- **Comparisons**: Before/after photo comparisons with design options

### Core Features
1. **AI Visualization Studio**: Premium photo upload with professional categorization
2. **Curated Design Marketplace**: Product recommendations with affiliate commerce integration
3. **Professional Design Collections**: Advanced mood board creation and management
4. **Advanced Comparison Tools**: Before/after visualization with design application options
5. **Subscription Management**: Freemium model with tiered professional plans
6. **Premium User Experience**: Sophisticated UI targeting design professionals

### API Structure
- `POST /api/photos/upload` - Multi-file upload with metadata
- `GET /api/photos` - Retrieve photos with optional filtering
- `DELETE /api/photos/:id` - Remove photos
- `POST /api/boards` - Create design boards
- `GET /api/boards` - List user's design boards
- Static file serving at `/uploads` for uploaded images

## Data Flow

1. **File Upload**: Client uploads files via drag-and-drop → Multer processes files → Files stored locally → Metadata saved to database
2. **Photo Display**: Client requests photos → API queries database → Returns photo metadata with URLs
3. **Design Boards**: Users create boards → Add photos to boards → Many-to-many relationships tracked
4. **Comparisons**: Select before/after photos → Store comparison metadata → Display side-by-side

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive Radix UI component library
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React and React Icons
- **Utilities**: date-fns, clsx, class-variance-authority

### Backend Dependencies
- **File Upload**: Multer with local disk storage
- **Database**: Drizzle ORM with PostgreSQL support
- **Session Management**: connect-pg-simple for PostgreSQL sessions
- **Development**: tsx for TypeScript execution

## Deployment Strategy

### Development Environment
- **Server**: Vite dev server with Express middleware
- **Database**: Local PostgreSQL or Neon development database
- **File Storage**: Local filesystem at `/uploads`
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend

### Production Environment
- **Platform**: Replit with autoscale deployment
- **Build Process**: Vite builds frontend to `dist/public`, esbuild bundles backend
- **Database**: Neon serverless PostgreSQL
- **File Storage**: Local filesystem (may need upgrade to cloud storage)
- **Process**: Node.js serves both static files and API endpoints

### Build Configuration
- Frontend builds to `dist/public` for static serving
- Backend bundles to `dist/index.js` for production execution
- Environment variables for database connection and file paths
- PostgreSQL session storage for user state management

## Monetization Strategy

### Current Implementation
- **Freemium Model**: 3 free visualizations, subscription tiers (Professional $29/mo, Studio $99/mo)
- **Affiliate Commerce**: Product marketplace with commission-based revenue from premium home decor brands
- **Premium Design Services**: Professional consultation booking and custom design packages
- **Enterprise Solutions**: White-label platform for design firms and furniture retailers

### Revenue Streams
1. Subscription-based access to professional AI visualization tools
2. Affiliate commissions from curated furniture and decor marketplace
3. Premium design consultation services and custom design packages
4. Enterprise licensing for design firms and real estate professionals
5. Educational content and design masterclasses
6. Data analytics services for furniture brands and market research

## Design Aesthetic

The platform targets design professionals and architecture-conscious users with:
- **Typography**: Playfair Display for headings, Montserrat for body text
- **Color Palette**: Sophisticated neutrals with premium gold/amber accents
- **Visual Style**: Clean, minimalist design inspired by high-end design studios
- **User Experience**: Premium interactions, subtle animations, professional-grade interface
- **Brand Positioning**: Luxury design tool for professionals and serious design enthusiasts

## User Preferences

Preferred communication style: Simple, everyday language.
Target audience: Interior designers, architects, and design-conscious homeowners seeking premium solutions.

## Changelog

- June 17, 2025: Initial setup with basic home design visualization
- June 17, 2025: Premium redesign with sophisticated aesthetic targeting design professionals
- June 17, 2025: Implemented comprehensive monetization strategy with freemium model and affiliate commerce
- June 17, 2025: Added pricing tiers, product marketplace, and premium design consultation features