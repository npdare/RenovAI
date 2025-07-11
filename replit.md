# RenovAI - Minimalist AI-Powered Interior Design Platform

## Overview

RenovAI is a sophisticated full-stack web application targeting interior designers, architects, and design-conscious homeowners. The platform provides AI-powered room visualization with a minimalist black and white aesthetic inspired by luxury design studios like Invilla. Features include genuine AI room analysis using GPT-4o, DALL-E 3 visualization generation, and a premium user experience focused on simplicity and sophistication.

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

The platform features a minimalist black and white aesthetic inspired by luxury design studios like Invilla:
- **Typography**: Inter font family for clean, modern typography with luxury spacing and weights
- **Color Palette**: Pure black and white with subtle gray accents, allowing design content to provide color pops
- **Visual Style**: Minimalist, luxury aesthetic with clean lines, generous white space, and sophisticated simplicity
- **User Experience**: Understated elegance with subtle hover effects and refined interactions
- **Brand Positioning**: RenovAI - Professional AI design tool with luxury minimalist aesthetic

## User Preferences

Preferred communication style: Simple, everyday language.
Target audience: Interior designers, architects, and design-conscious homeowners seeking premium solutions.

## AI Implementation

### Current AI Features
- **Room Analysis**: Computer vision analysis of uploaded photos using GPT-4o for room type detection, style identification, and design recommendations
- **AI Redesign Generation**: DALL-E 3 integration for creating room redesigns based on user preferences and style selections
- **Design Inspiration**: AI-generated design concepts for specific room types and style preferences
- **Personalized Recommendations**: Multi-photo analysis for comprehensive design advice and product suggestions
- **Product Curation**: AI-powered furniture and decor recommendations based on room analysis

### AI API Endpoints
- `POST /api/ai/analyze` - Room photo analysis and insights
- `POST /api/ai/redesign` - Generate room redesigns with DALL-E 3
- `POST /api/ai/inspiration` - Create design inspiration images
- `POST /api/ai/recommendations` - Personalized design recommendations
- `POST /api/ai/products` - Product recommendations based on room analysis

### AI Technology Stack
- **OpenAI GPT-4o**: Image analysis and design consultation
- **DALL-E 3**: High-quality room visualization generation
- **Computer Vision**: Room type and style detection
- **Natural Language Processing**: Design recommendation generation

## Database Integration

### Current Implementation
- **PostgreSQL Database**: Neon serverless PostgreSQL with Drizzle ORM
- **Database Storage**: Replaced in-memory storage with persistent database storage
- **Schema Relations**: Proper foreign key relationships between users, photos, design boards, and comparisons
- **Migration System**: Drizzle Kit for schema management and database migrations

## Changelog

- June 17, 2025: Initial setup with basic home design visualization
- June 17, 2025: Premium redesign with sophisticated aesthetic targeting design professionals
- June 17, 2025: Implemented comprehensive monetization strategy with freemium model and affiliate commerce
- June 17, 2025: Added pricing tiers, product marketplace, and premium design consultation features
- June 17, 2025: **Major Update**: Integrated OpenAI GPT-4o and DALL-E 3 for genuine AI-powered room analysis and redesign generation
- June 17, 2025: **Database Integration**: Implemented PostgreSQL database with Drizzle ORM replacing in-memory storage
- June 17, 2025: **AI Visualization Studio**: Created comprehensive AI interface for room analysis, redesign generation, and design inspiration
- June 17, 2025: **RenovAI Rebrand**: Complete platform transformation to minimalist black and white aesthetic inspired by Invilla design studio
- June 17, 2025: **Luxury Minimalist UI**: Implemented clean typography, sophisticated spacing, and understated elegance throughout the platform
- June 17, 2025: **Architectural Video Backgrounds**: Added high-end interior design and architectural video backgrounds showcasing luxury living spaces
- June 17, 2025: **Enhanced Button Aesthetics**: Implemented clean line icons and sophisticated hover effects inspired by minimalist design principles
- June 18, 2025: **Dynamic Product Marketplace**: Created infinite slider showcasing real furniture products for both interior and exterior spaces with authentic retailer links and working product images
- June 18, 2025: **Product Marketplace Complete**: Finalized infinite slider with professional furniture imagery, authentic retailer data from West Elm, CB2, DWR, and RH, working purchase links, and reliable image loading system
- June 18, 2025: **AI Design Studio Workflow**: Implemented comprehensive 6-step design transformation process: (1) Photo upload with HEIC support, (2) Multi-modal inspiration input (text/images/Pinterest), (3) AI parameter extraction, (4) Image transformation with strength controls, (5) Review and fine-tuning, (6) Export and sharing capabilities
- June 18, 2025: **Content-Aware Categorization**: Implemented dynamic AI categorization that analyzes inspiration images and returns appropriate category names based on detected content (e.g., wall images → "wall cladding", furniture → "exterior furniture") instead of predefined parameter lists
- June 19, 2025: **Comprehensive Mobile Optimization**: Implemented mobile-first responsive design across all platform components including adaptive typography, touch-friendly navigation with hamburger menu, mobile-optimized AI workflow layouts, responsive product showcase grids, and enhanced CSS utilities for mobile interactions with proper touch targets and responsive scaling
- June 19, 2025: **Brand Consistency Update**: Updated all references from "HomeVision" to "RenovAI" across footer, HTML meta tags, and documentation files to ensure consistent luxury minimalist branding throughout the platform
- June 19, 2025: **Studio Redesign**: Transformed "AI Design Studio" to "Studio" with architectural design-inspired aesthetic featuring blueprint patterns, geometric elements, and sophisticated light background with subtle material textures that evokes professional design studio environments rather than clinical software interfaces
- June 19, 2025: **Visual Process Guide**: Added comprehensive visual how-to guide to Studio page explaining the 4-step design transformation workflow with interactive icons, process flow visualization, and before/after concept illustrations to help users understand the AI design process
- June 19, 2025: **Interactive AI Output**: Implemented clickable hotspots on transformed images with detailed product information, comparable pricing from West Elm, CB2, and Design Within Reach, cost summary calculations, and professional product cards with direct retailer links
- June 19, 2025: **Workflow Fix**: Resolved UI progression issue where architectural analysis completed successfully but workflow didn't advance to subsequent steps, ensuring seamless user experience through all transformation phases
- June 19, 2025: **UX Redesign - Architecture Step**: Completely redesigned architectural elements interface with visual card layout, intuitive toggle switches, streamlined "Keep vs Transform" controls, and enhanced features summary replacing confusing individual checkboxes for better user flow
- June 19, 2025: **Dynamic Inspiration System**: Redesigned inspiration section to be contextual and responsive to uploaded photo content - dynamically generates element-specific categories (wall treatments for internal walls, exterior elements for outdoor spaces), integrates architectural features as actionable inspiration buttons, and provides relevant style suggestions based on selected transformation elements
- June 19, 2025: **Enhanced Upload Experience**: Improved photo upload flow with automatic scrolling to uploaded content, smooth slide-in animations, redesigned success state with professional gradient panel, and enhanced visual feedback to eliminate need for manual user interaction after upload
- June 19, 2025: **Comprehensive Design Elements Redesign**: Complete overhaul of architectural elements interface with enhanced space analysis providing detailed 3-4 sentence descriptions, vertical layout with Retain/Transform radio button controls, comprehensive 8-10 alternatives per element instead of 3, contextually appropriate icons matching actual design elements (windows→FrameIcon, doors→Square, flooring→Grid3X3, lighting→Lightbulb), and automatic scrolling throughout workflow to minimize user interactions
- June 19, 2025: **Dynamic Architectural Element Extraction**: Enhanced AI service to dynamically extract specific architectural features from photos including windows (with counts and descriptions), doors, roofing, exterior cladding, flooring, walls, ceilings, lighting, trim/molding, architectural features, landscaping, and fixtures. Implemented three-option system: "Retain Original", "Use Inspiration", or "Select Design Update" with manual element addition capability for missed features
- June 19, 2025: **Refined Design Elements Interface**: Removed mismatched icons, eliminated condition tracking, changed title to "Space Analysis", enhanced AI prompt for exhaustive element detection, and fixed TypeScript interface alignment for robust data flow. System now provides comprehensive architectural analysis without visual clutter
- June 19, 2025: **V2 Pipeline Implementation**: Implemented advanced multi-ControlNet workflow with Semantic Segmentation (SAM), depth mapping (MiDaS), Canny edge detection, and SDXL transformation pipeline. Added mask editing interface with brush/eraser tools, real-time mask visibility controls, and precise element selection. Created parallel v2 API endpoints (/api/v2/preprocess, /api/v2/architectural-analysis, /api/v2/transform-image) alongside existing v1 pipeline for A/B testing and enhanced geometric control
- June 19, 2025: **V2 Pipeline Complete**: Successfully integrated complete V2 Advanced Pipeline with toggle between V1 Standard and V2 Advanced workflows. Added quality metrics display, comprehensive mask editor interface, pipeline comparison component, and enhanced user feedback. User confirmed excellent performance of dynamic architectural element analysis system
- June 19, 2025: **Visual Inspiration Enhancement**: Fixed inspiration image display by adding contextual image mapping for design categories, implemented smart image selection based on material types (wood siding, metal panels, concrete, etc.), and enhanced visual examples with hover effects and fallback handling
- June 19, 2025: **Transformation Pipeline Fix**: Resolved Replicate API error by adding missing prompt parameter to ControlNet edge detection and updated prompt generation to use dynamic categories instead of legacy parameter arrays for accurate design transformations
- June 19, 2025: **Architectural Analysis Recovery**: Fixed JSON truncation issues causing poor detection results by increasing token limit from 800 to 2000 tokens and implementing automatic JSON repair for incomplete OpenAI responses. Enhanced error handling to ensure complete architectural element detection
- June 19, 2025: **Smart Material Application System**: Implemented AI-powered material distribution using architectural design principles to intelligently apply multiple selected materials (e.g., natural stone base with timber accent panels) instead of random combinations
- June 19, 2025: **Maximum Structural Preservation**: Enhanced ControlNet transformation with 1.2 conditioning scale, reduced strength to 4.7%, and enhanced negative prompts to prevent structural alterations while maintaining photorealistic material changes
- June 19, 2025: **ControlNet API Fix**: Resolved 422 API error by updating to working ControlNet model, simplified pipeline to single-step transformation with 1.5 conditioning scale for maximum structural preservation
- June 19, 2025: **SDXL img2img Structural Preservation**: Switched from failing ControlNet models to proven SDXL img2img with 25% strength for maximum structural preservation, avoiding DALL-E issues while maintaining exact building geometry during material transformations