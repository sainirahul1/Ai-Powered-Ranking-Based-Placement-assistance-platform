# TalentAI - Project Architecture Documentation

## Project Overview
**TalentAI** is an AI-Powered Ranking-Based Placement Assistance Platform that helps users prepare for job interviews and create personalized career roadmaps using artificial intelligence.

---

## 1. TECHNOLOGY STACK

### Frontend Technologies
| Technology | Version | Purpose |
|---|---|---|
| **React** | ^18.3.1 | UI Framework |
| **TypeScript** | Latest | Type Safety |
| **Vite** | Latest | Build Tool & Dev Server |
| **Tailwind CSS** | ^4.1.18 | Utility-first CSS Framework |
| **Radix UI** | Latest | Unstyled, accessible component library |
| **Framer Motion** | ^11.18.2 | Animation library |
| **React Hook Form** | ^7.71.1 | Form state management |
| **Zod** | ^3.25.76 | Schema validation |
| **TanStack React Query** | ^5.60.5 | Data fetching & caching |
| **Wouter** | ^3.3.5 | Lightweight routing |
| **Recharts** | ^2.15.2 | Data visualization (charts) |
| **Lucide React** | ^0.453.0 | Icon library |

### Backend Technologies
| Technology | Version | Purpose |
|---|---|---|
| **Express.js** | ^5.0.1 | Web framework |
| **Node.js** | Latest | Runtime environment |
| **TypeScript** | Latest | Type Safety |
| **Drizzle ORM** | ^0.39.3 | SQL Database ORM |
| **PostgreSQL** | 8.16.3 | Primary relational database |
| **Mongoose** | ^9.1.4 | MongoDB ODM (optional) |

### AI & Integration Services
| Service | API | Purpose |
|---|---|---|
| **Google Gemini** | ^0.24.1 | AI-powered responses & evaluation |
| **OpenAI** | ^6.16.0 | Alternative AI provider |
| **HuggingFace** | ^4.13.9 | ML model inference |
| **WebSocket (ws)** | ^8.18.0 | Real-time communication |

### Authentication & Security
| Technology | Version | Purpose |
|---|---|---|
| **JWT (jsonwebtoken)** | ^9.0.3 | Token-based authentication |
| **Passport.js** | ^0.7.0 | Authentication middleware |
| **Bcryptjs** | ^3.0.3 | Password hashing |
| **express-session** | ^1.18.1 | Session management |

### Development Tools
| Tool | Purpose |
|---|---|
| **tsx** | TypeScript executor |
| **Drizzle Kit** | Database schema migrations |
| **cross-env** | Cross-platform environment variables |

---

## 2. PROJECT STRUCTURE

```
ai-powered-ranking-platform/
├── client/                          # Frontend React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # Radix UI components (40+ components)
│   │   │   │   ├── Layout.tsx      # Main layout wrapper
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   └── ... (40+ UI components)
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Roadmap.tsx         # Career roadmap generation
│   │   │   ├── Interview.tsx       # Mock interview interface
│   │   │   └── not-found.tsx       # 404 page
│   │   ├── hooks/
│   │   │   ├── use-interview.ts    # Interview state logic
│   │   │   ├── use-roadmap.ts      # Roadmap generation logic
│   │   │   ├── use-toast.ts        # Toast notifications
│   │   │   └── use-mobile.tsx      # Mobile detection
│   │   ├── contexts/               # React contexts
│   │   ├── lib/
│   │   │   ├── queryClient.ts      # TanStack Query client setup
│   │   │   └── utils.ts            # Utility functions
│   │   ├── data/
│   │   │   └── extendedQuestions.ts # 100+ interview questions
│   │   ├── App.tsx                 # Main app component
│   │   ├── main.tsx                # React DOM entry
│   │   └── index.css               # Global styles
│   ├── public/                      # Static assets
│   ├── replit_integrations/         # Replit-specific integrations
│   │   └── audio/                  # Audio utilities
│   └── index.html
│
├── server/                          # Backend Node.js/Express App
│   ├── index.ts                    # Server entry point (COMMENTED OUT)
│   ├── routes.ts                   # Route definitions (158 lines)
│   ├── aiService.ts                # AI evaluation logic
│   ├── db.ts                       # Database connection
│   ├── storage.ts                  # Data persistence
│   ├── vite.ts                     # Vite integration
│   ├── static.ts                   # Static file serving
│   ├── test-api.ts                 # API testing utilities
│   ├── test-db.ts                  # Database testing
│   ├── models/
│   │   └── mongoSchemas.ts         # MongoDB schema definitions
│   └── replit_integrations/        # Third-party integrations
│       ├── chat/                   # Chat routes (OpenAI/Gemini)
│       │   ├── index.ts
│       │   ├── routes.ts
│       │   └── storage.ts
│       ├── image/                  # Image generation routes
│       │   ├── index.ts
│       │   ├── routes.ts
│       │   └── client.ts
│       ├── audio/                  # Audio routes
│       │   ├── index.ts
│       │   ├── routes.ts
│       │   └── client.ts
│       └── batch/                  # Batch processing
│           ├── index.ts
│           └── utils.ts
│
├── shared/                         # Shared code (Frontend + Backend)
│   ├── schema.ts                  # Database schema (Drizzle ORM)
│   ├── routes.ts                  # API route definitions
│   └── models/
│       └── chat.ts                # Chat data models
│
├── script/
│   └── build.ts                   # Custom build script
│
├── Configuration Files
├── drizzle.config.ts              # Drizzle ORM configuration
├── vite.config.ts                 # Vite bundler configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── package.json                   # Dependencies & scripts
├── components.json                # Component metadata
└── README.md

```

---

## 3. ARCHITECTURE LAYERS

### 3.1 Frontend Architecture

```
┌─────────────────────────────────────────────────────┐
│              UI Components Layer                     │
│        (Radix UI + Custom Components)               │
├─────────────────────────────────────────────────────┤
│              Pages Layer                             │
│   (Home, Roadmap, Interview, NotFound)              │
├─────────────────────────────────────────────────────┤
│         State Management Layer                       │
│    (React Hooks, Contexts, TanStack Query)          │
├─────────────────────────────────────────────────────┤
│              API Client Layer                        │
│      (React Query for data fetching)                │
├─────────────────────────────────────────────────────┤
│              Backend API Layer                       │
│        (Express REST API endpoints)                 │
└─────────────────────────────────────────────────────┘
```

### 3.2 Backend Architecture

```
┌─────────────────────────────────────────────────────┐
│         Client Request Handler (Express)             │
├─────────────────────────────────────────────────────┤
│         Middleware Layer                             │
│   (Auth, CORS, Error Handling, Logging)             │
├─────────────────────────────────────────────────────┤
│         Route Handler Layer                          │
│   (Roadmap, Interview, Chat, Image, Audio)          │
├─────────────────────────────────────────────────────┤
│         Business Logic Layer                         │
│   - AI Service (aiService.ts)                       │
│   - Storage Service (storage.ts)                    │
│   - Integration Services (Chat, Image, Audio)       │
├─────────────────────────────────────────────────────┤
│         Data Access Layer                            │
│   (Drizzle ORM with PostgreSQL/MongoDB)             │
├─────────────────────────────────────────────────────┤
│         Database Layer                               │
│   - PostgreSQL (Primary)                            │
│   - MongoDB (Optional)                              │
└─────────────────────────────────────────────────────┘
```

---

## 4. DATABASE SCHEMA

### Primary Database: PostgreSQL

#### Tables (via Drizzle ORM):

**1. Users Table**
```typescript
- id: serial (PK)
- email: text (unique)
- name: text
```

**2. Roadmaps Table**
```typescript
- id: serial (PK)
- role: text (e.g., "Frontend Developer")
- experienceLevel: text (e.g., "Beginner")
- goals: text
- generatedContent: jsonb (AI-generated steps)
- createdAt: timestamp
```

**3. Interviews Table**
```typescript
- id: serial (PK)
- topic: text
- difficulty: text ("Easy", "Medium", "Hard")
- status: text ("pending", "active", "completed")
- feedback: jsonb (AI feedback)
- answers: jsonb ([{question, answer, score, feedback}])
- createdAt: timestamp
```

**4. Chat Messages (via models/chat.ts)**
```typescript
- User & Assistant message history
- Stored in MongoDB or PostgreSQL
```

---

## 5. API ENDPOINTS

### Core Endpoints

#### Roadmap Generation
```
POST /api/roadmap/generate
Body: {
  role: string,
  experienceLevel: string,
  goals: string
}
Response: Roadmap object with AI-generated steps
```

#### Interview Session Management
```
POST /api/interview/session/start
Body: {
  name: string,
  domains: Array<string>,
  duration: number (minutes)
}
Response: { token, message, session }

GET /api/interview/session/timer
Headers: Authorization: Bearer <JWT_TOKEN>
Response: Remaining time

POST /api/interview/evaluate
Body: {
  question: string,
  answer: string
}
Response: { score: 0-100, feedback: string }
```

### Integration Endpoints

#### Chat Routes
```
POST /api/chat/send
- OpenAI/Gemini integration
```

#### Image Routes
```
POST /api/image/generate
- Image generation service
```

#### Audio Routes
```
POST /api/audio/record
POST /api/audio/transcribe
- Voice input & processing
```

---

## 6. DATA FLOW DIAGRAMS

### 6.1 Roadmap Generation Flow

```
User Input (Role, Level, Goals)
        ↓
    React Form
        ↓
React Query (API Request)
        ↓
  Express Routes
        ↓
AI Service (Gemini API)
        ↓
Generate Steps & Resources
        ↓
Drizzle ORM (PostgreSQL)
        ↓
Store in Database
        ↓
Return to Frontend
        ↓
Display Roadmap with Resources
```

### 6.2 Mock Interview Flow

```
User Selects Domain & Difficulty
        ↓
Start Interview Session
        ↓
Generate JWT Token (Session Lock)
        ↓
Load Questions (extendedQuestions.ts)
        ↓
User Answers Question
        ↓
Extract & Evaluate via AI Service
        ↓
Calculate Score (0-100)
        ↓
Generate Feedback via Gemini
        ↓
Store Answers & Feedback
        ↓
Display Results & Next Question
        ↓
End Session → Show Final Report
```

### 6.3 Authentication Flow

```
User Login/Register
        ↓
Passport.js Authentication
        ↓
Validate Credentials (bcryptjs)
        ↓
Generate JWT Token
        ↓
Session Management (express-session)
        ↓
Store Session (Memory or PostgreSQL)
        ↓
Return Token to Client
        ↓
Client Stores Token (localStorage/cookie)
        ↓
Include in Authorization Header for Requests
```

---

## 7. KEY FEATURES & COMPONENTS

### Frontend Features

1. **Home Page**
   - Hero section with CTAs
   - Feature cards (Roadmap, Interview)
   - Animations (Framer Motion)

2. **Roadmap Generator**
   - Form input: Role, Experience Level, Goals
   - AI generates personalized learning path
   - Resource recommendations (curated URLs)
   - Progress tracking

3. **Mock Interview Module**
   - 10+ domains with 100+ questions
   - 3 difficulty levels: Easy, Medium, Hard
   - Real-time evaluation via Gemini AI
   - Score calculation (0-100)
   - Detailed feedback
   - Session timer with JWT validation

4. **UI Components**
   - 40+ Radix UI components
   - Dark mode support (next-themes)
   - Responsive design (Mobile-first)
   - Toast notifications
   - Modals, Dialogs, Drawers

### Backend Features

1. **AI Integration**
   - Google Gemini: Main AI evaluation engine
   - OpenAI: Alternative provider
   - HuggingFace: ML model inference

2. **Session Management**
   - JWT-based authentication
   - Session tokens with expiration
   - Secure interview locking

3. **Data Persistence**
   - PostgreSQL for relational data
   - MongoDB for document storage (optional)
   - Drizzle ORM for type-safe queries

4. **Integration Services**
   - Chat (Multi-turn conversations)
   - Image Generation (DALL-E or similar)
   - Audio Processing (voice-to-text, text-to-speech)
   - Batch Processing

---

## 8. SECURITY ARCHITECTURE

### Frontend Security
- Input validation with Zod schemas
- XSS protection via React's built-in escaping
- CSRF token handling

### Backend Security
- JWT token-based authentication
- Password hashing with bcryptjs
- Passport.js middleware
- Session management
- Rate limiting capabilities
- API validation with Zod

### Data Security
- PostgreSQL with secure connections
- Environment variables for secrets (.env)
- Sensitive data encryption

---

## 9. DEPLOYMENT ARCHITECTURE

### Build Process
```
Development
    ↓
TypeScript Compilation
    ↓
Vite Bundling (Frontend)
    ↓
tsx Running (Backend)
    ↓
Drizzle Migrations (DB)
    ↓
Static File Serving
    ↓
Production Bundle (server + client)
```

### Environment Configuration
```
.env file contains:
- DATABASE_URL (PostgreSQL)
- AI_INTEGRATIONS_OPENAI_API_KEY
- AI_INTEGRATIONS_GEMINI_API_KEY
- HUGGINGFACE_API_KEY
- SESSION_SECRET (JWT)
```

---

## 10. PERFORMANCE CONSIDERATIONS

### Frontend Optimization
- **Code Splitting**: Lazy loading routes with Wouter
- **Caching**: React Query with stale-while-revalidate
- **Image Optimization**: Responsive images
- **Bundle Size**: Tree-shaking with Vite
- **State Management**: Efficient context usage

### Backend Optimization
- **Database Indexing**: PostgreSQL query optimization
- **Connection Pooling**: pg Pool configuration
- **Caching Strategy**: Session caching in memory
- **API Response Compression**: gzip compression
- **Load Balancing**: WebSocket support for real-time features

---

## 11. SCALABILITY ARCHITECTURE

### Horizontal Scaling
- Stateless Express server design
- Session storage in PostgreSQL (scalable)
- JWT for distributed authentication
- Load balancer ready (reverse proxy support)

### Vertical Scaling
- Connection pooling for database
- Memory optimization
- Efficient query patterns with Drizzle ORM

### Caching Strategy
- React Query client-side caching
- Session caching
- API response caching

---

## 12. MONITORING & LOGGING

### Implemented
- API request/response logging
- AI service error handling
- Database operation logging

### Recommended for Production
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Log aggregation (ELK stack, CloudWatch)
- Uptime monitoring (Pingdom, UptimeRobot)
- APM (Application Performance Monitoring)

---

## 13. DEVELOPMENT WORKFLOW

### Scripts
```json
{
  "dev": "Development server with hot reload",
  "build": "Production build bundle",
  "start": "Start production server",
  "check": "TypeScript type checking",
  "db:push": "Drizzle migrations"
}
```

### Development Tools
- **Vite Dev Server**: Fast HMR
- **TypeScript**: Full type safety
- **Drizzle Kit**: Database schema management
- **Replit Integration**: Runtime error modal

---

## 14. TECH DECISION RATIONALE

| Decision | Reason |
|---|---|
| React + TypeScript | Type safety, large ecosystem |
| Tailwind CSS | Rapid UI development, customizable |
| Drizzle ORM | Type-safe SQL, better DX than Prisma |
| PostgreSQL | Reliable, ACID compliance, scalable |
| Express.js | Lightweight, proven, flexible |
| Gemini API | Fast, cost-effective AI evaluation |
| JWT + Sessions | Distributed auth, session persistence |
| Vite | Fast builds, modern tooling |

---

## 15. FUTURE ENHANCEMENTS

1. **Machine Learning**
   - Performance prediction models
   - Personalized question recommendations
   - Resume parsing & analysis

2. **Real-time Features**
   - Live interview feedback
   - Collaborative learning
   - Peer comparison

3. **Integration Expansion**
   - LinkedIn profile import
   - Calendar sync for interview scheduling
   - Payment integration (subscriptions)

4. **Analytics**
   - User progress tracking
   - Success metrics dashboard
   - Interview preparation insights

5. **Internationalization**
   - Multi-language support
   - Regional question sets
   - Localized UI

---

## 16. DEPLOYMENT RECOMMENDATIONS

### Cloud Platform Suggestions
- **Vercel**: Frontend deployment
- **Railway/Render**: Backend deployment
- **AWS RDS**: Managed PostgreSQL
- **AWS S3**: Static asset storage

### CI/CD Pipeline
- GitHub Actions for automated testing
- Automated deployment on main branch
- Database migration automation
- Environment-specific builds

---

## Conclusion

TalentAI is a modern, full-stack web application with:
- **Robust Frontend**: React with TypeScript and Tailwind CSS
- **Scalable Backend**: Express.js with PostgreSQL
- **AI Integration**: Google Gemini for intelligent evaluation
- **Production-Ready**: Security, error handling, and monitoring built-in

The architecture supports growth from MVP to enterprise-scale application with clear separation of concerns and modern development practices.
