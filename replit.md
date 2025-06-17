# HomeVision - AI-Powered Home Design Platform

## Overview

HomeVision is a full-stack web application that allows users to upload photos of their homes and explore design possibilities through AI-powered visualization tools. The platform features photo management, inspiration galleries, design boards, and before/after comparison tools.

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
1. **Photo Upload System**: Multi-file upload with type categorization (home, floorplan, inspiration)
2. **Inspiration Gallery**: Browse and save design inspiration with sample images
3. **Design Boards**: Create and manage collections of inspiration photos
4. **Comparison Tool**: Side-by-side before/after visualization
5. **File Management**: Secure file storage with size and type validation

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

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 17, 2025. Initial setup