# AI-Powered Full-Stack Application

A comprehensive full-stack JavaScript application featuring integrated AI capabilities for chat, image generation, and audio processing.

## 🚀 Features

- **AI Chat Interface**: Real-time conversational AI with persistent message history.
- **Image Generation**: Generate high-quality images directly from text prompts.
- **Audio Processing**: AI-driven audio features including transcription and synthesis.
- **Modern UI/UX**: Built with React and Shadcn/UI for a clean, responsive, and accessible user experience.
- **Integrated Database**: Persistent storage for user data and AI interactions using PostgreSQL.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TanStack Query, Shadcn/UI, Tailwind CSS, Wouter.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL (Neon-backed) with Drizzle ORM.
- **AI Services**: Replit AI Integrations (OpenAI-powered).
- **Validation**: Zod for end-to-end type safety.

## 📂 Project Structure

- `client/`: Frontend React application.
- `server/`: Express backend, API routes, and storage logic.
- `shared/`: Shared schemas and types used by both frontend and backend.
- `attached_assets/`: Generated images and static assets.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server (runs both frontend and backend):
```bash
npm run dev
```
The application will be available at `http://0.0.0.0:5000`.

## 🚢 Deployment

This project is optimized for deployment on **Replit**.

1. Click the **Publish** button in the Replit interface.
2. Replit will automatically handle building the application, hosting, and SSL/TLS configuration.

## 📄 License

MIT
