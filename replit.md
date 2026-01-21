# TalentAI - Career Acceleration Platform

## Overview

TalentAI is an AI-powered career development platform that helps users accelerate their tech careers through two main features:

1. **AI Roadmap Generator** - Creates personalized weekly learning roadmaps based on role, experience level, and career goals
2. **Mock Interview System** - Provides AI-driven interview practice with camera/microphone integration

The application uses a modern full-stack architecture with React frontend, Express backend, PostgreSQL database, and OpenAI integration for AI features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and UI effects
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Build Tool**: Vite with custom Replit plugins

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Structure**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type safety
- **AI Service**: OpenAI API integration via Replit AI Integrations (configured through environment variables)

### Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit (`db:push` command for schema sync)
- **Development Fallback**: MemStorage class provides in-memory storage when database operations aren't critical

### Key Design Patterns
- **Shared Types**: The `shared/` directory contains schemas and route definitions used by both frontend and backend, ensuring type safety across the stack
- **API Contract**: Routes are defined declaratively in `shared/routes.ts` with input/output schemas
- **Component Library**: shadcn/ui components in `client/src/components/ui/` provide consistent, accessible UI elements

### Replit AI Integrations
The `server/replit_integrations/` directory contains pre-built modules for:
- **Chat**: Conversation management with streaming support
- **Audio**: Voice recording, speech-to-text, and text-to-speech
- **Image**: Image generation via gpt-image-1
- **Batch**: Rate-limited batch processing utilities

## External Dependencies

### AI Services
- **OpenAI API**: Used for roadmap generation and interview features
  - Configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables
  - Model: gpt-5 for chat completions, gpt-image-1 for image generation

### Database
- **PostgreSQL**: Primary data store
  - Connection via `DATABASE_URL` environment variable
  - Tables: users, roadmaps, interviews, conversations, messages

### Third-Party Libraries
- **Drizzle ORM**: Type-safe database queries with PostgreSQL dialect
- **Zod**: Runtime validation for API inputs and form data
- **TanStack Query**: Client-side data fetching and caching
- **Radix UI**: Headless UI primitives (via shadcn/ui)
- **FFmpeg**: Audio format conversion (WebM to WAV) for voice features