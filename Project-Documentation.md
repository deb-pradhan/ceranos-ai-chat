# CERANOS AI Chat - Project Documentation

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Routes & Navigation](#routes--navigation)
- [Authentication System](#authentication-system)
- [Database Schema](#database-schema)
- [Edge Functions](#edge-functions)
- [Environment Variables](#environment-variables)
- [UI Components & Theming](#ui-components--theming)
- [Core Components](#core-components)
- [Hooks & Utilities](#hooks--utilities)
- [Styling System](#styling-system)
- [Security & Best Practices](#security--best-practices)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)

## Overview

CERANOS is a modern AI-powered chat application built with React and Supabase. It features real-time messaging, user authentication, chat history management, and a responsive design optimized for both desktop and mobile devices.

### Key Features
- 🤖 AI-powered conversations with streaming responses
- 🔐 Secure authentication with Supabase Auth
- 💬 Chat history management and persistence
- 📱 Responsive design (mobile-first approach)
- 🌙 Light/Dark theme support
- 🎨 Modern UI with shadcn/ui components
- ⚡ Real-time message streaming
- 🔄 Message regeneration functionality

## User Flow

### Complete User Journey

<lov-mermaid>
flowchart TD
    A[User Visits App] --> B{First Time User?}
    B -->|Yes| C[View Welcome Interface]
    B -->|No| D[Load Previous Session]
    
    C --> E[Browse Without Account]
    D --> F[Restore Chat History]
    
    E --> G{Want to Chat?}
    F --> G
    
    G -->|Yes| H{Authenticated?}
    G -->|No| I[Continue Browsing]
    
    H -->|No| J[Show Login Popup]
    H -->|Yes| K[Access Chat Interface]
    
    J --> L[Choose Auth Method]
    L --> M[Complete Authentication]
    M --> K
    
    K --> N[Select Existing Chat or Create New]
    N --> O[Compose Message]
    O --> P[Send Message]
    
    P --> Q[AI Processing with Loading States]
    Q --> R[Stream Response]
    R --> S[Display Complete Response]
    
    S --> T{User Action?}
    T -->|New Message| O
    T -->|Regenerate| U[Regenerate Last Response]
    T -->|New Chat| V[Create New Chat]
    T -->|Manage History| W[Rename/Delete Chats]
    T -->|Sign Out| X[End Session]
    
    U --> Q
    V --> N
    W --> N
    X --> A
    
    I --> Y[View Documentation/Features]
    Y --> G
</lov-mermaid>

### Authentication Flow Detail

<lov-mermaid>
flowchart LR
    A[User Attempts Action] --> B{Requires Auth?}
    B -->|No| C[Allow Action]
    B -->|Yes| D{User Signed In?}
    
    D -->|Yes| E[Verify Session]
    D -->|No| F[Show Login Modal]
    
    E --> G{Valid Session?}
    G -->|Yes| C
    G -->|No| F
    
    F --> H[Select Provider]
    H --> I[OAuth Redirect]
    I --> J[Supabase Auth]
    J --> K[Create/Update Profile]
    K --> L[Return to App]
    L --> C
</lov-mermaid>

## Tech Stack

### Frontend Framework
- **React 18.3.1** - Core UI library
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and development server
- **React Router DOM 6.30.1** - Client-side routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible React components
- **Lucide React 0.462.0** - Icon library
- **class-variance-authority** - Type-safe component variants
- **tailwindcss-animate** - Animation utilities

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Edge Functions
- **Supabase JS 2.55.0** - JavaScript client library

### State Management & Data Fetching
- **TanStack Query 5.83.0** - Server state management
- **React Context** - Local state management
- **React Hook Form 7.61.1** - Form handling

### Additional Libraries
- **Sonner** - Toast notifications
- **next-themes** - Theme management
- **date-fns** - Date utilities
- **zod** - Schema validation

## Architecture

The application follows a modern React architecture with clear separation of concerns:

<lov-mermaid>
graph TB
    subgraph "Frontend Layer"
        A[React Client]
        B[Components]
        C[Hooks & Context]
        D[UI State]
    end
    
    subgraph "Backend Layer"
        E[Supabase]
        F[PostgreSQL Database]
        G[Authentication]
        H[Real-time Subscriptions]
    end
    
    subgraph "AI Layer"
        I[Edge Function]
        J[OpenAI API]
        K[Streaming Response]
    end
    
    A --> B
    A --> C
    C --> D
    
    B --> E
    C --> G
    D --> H
    
    E --> F
    E --> I
    I --> J
    I --> K
    
    K --> A
</lov-mermaid>

### Data Flow Architecture

<lov-mermaid>
sequenceDiagram
    participant U as User
    participant RC as React Client
    participant SB as Supabase
    participant EF as Edge Function
    participant AI as OpenAI API
    
    U->>RC: Send Message
    RC->>SB: Authenticate User
    SB-->>RC: Auth Token
    RC->>SB: Save User Message
    RC->>EF: Send to AI Webhook
    EF->>AI: Process Message
    AI-->>EF: Stream Response
    EF-->>RC: Server-Sent Events
    RC->>SB: Save AI Response
    RC->>U: Display Messages
</lov-mermaid>

### Component Architecture
- **Container Components** - Handle data fetching and state management
- **Presentation Components** - Pure UI components with props
- **Hook Components** - Custom hooks for business logic
- **Context Providers** - Global state management

## Project Structure

### Component Architecture Overview

<lov-mermaid>
graph TD
    subgraph "Application Layer"
        A[App.tsx]
        B[Index.tsx]
        C[NotFound.tsx]
    end
    
    subgraph "Context Layer"
        D[AuthContext]
        E[QueryClient]
        F[TooltipProvider]
    end
    
    subgraph "Layout Components"
        G[AppSidebar]
        H[ChatInterface]
        I[TopBar]
    end
    
    subgraph "Feature Components"
        J[MessageList]
        K[ChatInput]
        L[InstructionCard]
        M[LoadingIndicators]
    end
    
    subgraph "Auth Components"
        N[AuthGuard]
        O[LoginPopup]
        P[LoginScreen]
    end
    
    subgraph "UI Layer"
        Q[shadcn/ui Components]
        R[Custom Hooks]
        S[Utilities]
    end
    
    A --> D
    A --> E
    A --> F
    B --> G
    B --> H
    H --> I
    H --> J
    H --> K
    H --> L
    G --> N
    N --> O
    N --> P
    J --> Q
    K --> Q
    All --> R
    All --> S
</lov-mermaid>

### File System Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   │   ├── AuthGuard.tsx
│   │   ├── LoginPopup.tsx
│   │   └── LoginScreen.tsx
│   ├── chat/            # Chat-related components
│   │   ├── ChatInput.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── InstructionCard.tsx
│   │   ├── LoadingIndicators.tsx
│   │   ├── MessageList.tsx
│   │   └── TopBar.tsx
│   ├── sidebar/         # Sidebar components
│   │   └── AppSidebar.tsx
│   └── ui/             # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (30+ components)
├── contexts/            # React Context providers
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   ├── useChatHistory.ts
│   └── useTheme.ts
├── integrations/       # Third-party integrations
│   └── supabase/
│       ├── client.ts
│       └── types.ts
├── lib/               # Utility functions
│   └── utils.ts
├── pages/             # Page components
│   ├── Index.tsx
│   └── NotFound.tsx
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

### Backend Structure & Database Relationships

<lov-mermaid>
erDiagram
    PROFILES {
        uuid id PK
        text email
        timestamp created_at
    }
    
    CHATS {
        uuid id PK
        uuid user_id FK
        text title
        timestamp created_at
        timestamp updated_at
    }
    
    MESSAGES {
        bigint id PK
        uuid chat_id FK
        uuid user_id FK
        text role
        text content
        timestamp created_at
    }
    
    AUTH_USERS {
        uuid id PK
        text email
        timestamp created_at
    }
    
    AUTH_USERS ||--|| PROFILES : "has profile"
    AUTH_USERS ||--o{ CHATS : "creates chats"
    AUTH_USERS ||--o{ MESSAGES : "sends messages"
    CHATS ||--o{ MESSAGES : "contains messages"
</lov-mermaid>

### Supabase Structure
```
supabase/
├── functions/         # Edge Functions
│   └── chat-webhook/
│       └── index.ts
├── migrations/        # Database migrations
└── config.toml       # Supabase configuration
```

## Routes & Navigation

### Route Configuration
```typescript
// App.tsx
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Current Routes
- **`/`** - Main chat interface (Index page)
- **`/*`** - 404 Not Found page

### Navigation Patterns
- **Single Page Application** - All chat functionality on main route
- **State-based Navigation** - Chat selection via sidebar state
- **Mobile-Responsive** - Collapsible sidebar with overlay

## Authentication System

### Supabase Auth Integration
```typescript
// AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Authentication state management
  // Session handling
  // Sign in/out methods
};
```

### Authentication Flow
1. **Anonymous Access** - Users can view interface without auth
2. **Login Required** - Authentication required for sending messages
3. **Session Persistence** - Automatic session restoration
4. **Social Providers** - Configured via Supabase Auth

### Protected Actions
- Sending messages
- Creating new chats
- Accessing chat history
- Profile management

## Database Schema

### Tables Structure

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `chats`
```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Row Level Security (RLS)
- **profiles**: Users can only access their own profile
- **chats**: Users can only access their own chats
- **messages**: Users can only access messages from their own chats

## Edge Functions

### chat-webhook Function
Located: `supabase/functions/chat-webhook/index.ts`

**Purpose**: Handles AI chat responses with streaming

**Features**:
- OpenAI API integration
- Streaming response handling
- Message persistence
- Error handling
- CORS support

**Configuration**:
```toml
# supabase/config.toml
[functions.chat-webhook]
verify_jwt = false
```

**Request Format**:
```typescript
{
  message: string;
  chatId?: string;
  userId: string;
}
```

**Response**: Server-Sent Events (SSE) stream

## Environment Variables

### Required Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_PROJECT_ID="your-project-id"
```

### Development Setup
```bash
# Copy environment template
cp .env.example .env

# Add your Supabase credentials
# Available in Supabase Dashboard > Settings > API
```

## UI Components & Theming

### Design System
The app uses a comprehensive design system built on Tailwind CSS with custom CSS variables.

#### Color Palette
```css
/* Light Theme */
--bg-base: 0 0% 100%;
--bg-surface: 240 10% 3.9%;
--text-primary: 240 10% 3.9%;
--text-secondary: 240 3.8% 46.1%;

/* Dark Theme */
--bg-base: 240 10% 3.9%;
--bg-surface: 240 3.7% 15.9%;
--text-primary: 0 0% 98%;
--text-secondary: 240 5% 64.9%;
```

#### Typography System
```css
.font-brand {
  font-family: 'DM Serif Display', serif;
}

.font-sans {
  font-family: 'Inter', sans-serif;
}
```

### shadcn/ui Components
30+ pre-built, accessible components including:
- **Navigation**: Button, Dialog, Dropdown Menu
- **Forms**: Input, Textarea, Select, Checkbox
- **Feedback**: Toast, Alert, Loading Skeleton
- **Layout**: Card, Separator, Scroll Area

### Component Variants
```typescript
// Example: Button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
);
```

## Core Components

### ChatInterface
**File**: `src/components/chat/ChatInterface.tsx`
**Purpose**: Main chat container component

**Features**:
- Message history display
- Real-time message streaming
- Loading states with phases
- Message regeneration
- New chat creation

**State Management**:
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [streamingContent, setStreamingContent] = useState('');
const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('idle');
```

### AppSidebar
**File**: `src/components/sidebar/AppSidebar.tsx`
**Purpose**: Navigation and chat history management

**Features**:
- Chat list with search
- New chat creation
- Chat renaming and deletion
- Authentication controls
- Mobile-responsive design

### MessageList
**File**: `src/components/chat/MessageList.tsx`
**Purpose**: Display chat messages with formatting

**Features**:
- User/Assistant message differentiation
- Code syntax highlighting
- Copy to clipboard functionality
- Loading indicators
- Empty state handling

### AuthGuard & LoginPopup
**Files**: `src/components/auth/`
**Purpose**: Authentication UI components

**Features**:
- Protected route access
- Login modal dialogs
- Social authentication options
- Session management

## Hooks & Utilities

### Custom Hooks

#### useChatHistory
```typescript
// Manages chat CRUD operations
const {
  chats,
  currentChat,
  messages,
  createChat,
  updateChatTitle,
  deleteChat,
  loadMessages
} = useChatHistory();
```

#### useAuth
```typescript
// Authentication state management
const {
  user,
  isLoading,
  signIn,
  signOut,
  signUp
} = useAuth();
```

#### useTheme
```typescript
// Theme switching functionality
const {
  theme,
  setTheme,
  toggleTheme
} = useTheme();
```

#### use-mobile
```typescript
// Responsive design hook
const isMobile = useIsMobile(); // Boolean for mobile detection
```

### Utility Functions
**File**: `src/lib/utils.ts`

```typescript
// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Additional utility functions for:
// - Date formatting
// - Text processing
// - Validation helpers
```

## Styling System

### CSS Architecture
1. **Global Styles** (`index.css`) - Design tokens, base styles
2. **Component Styles** - Tailwind utility classes
3. **Theme Variables** - CSS custom properties
4. **Animation System** - Custom keyframes and transitions

### Responsive Design
```css
/* Mobile First Approach */
.sidebar {
  @apply fixed left-0 top-0 h-full z-50 transform transition-transform duration-300;
  @apply lg:relative lg:translate-x-0;
}

/* Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Animation System
```css
/* Loading animations */
@keyframes loading-dot {
  0%, 20% { transform: scale(1); }
  50% { transform: scale(1.2); }
  80%, 100% { transform: scale(1); }
}

/* Smooth transitions */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Security & Best Practices

### Authentication Security
- **JWT Tokens** - Secure token-based authentication
- **Row Level Security** - Database-level access control
- **Session Management** - Automatic token refresh
- **CORS Configuration** - Controlled cross-origin access

### Data Security
- **Input Sanitization** - All user inputs validated
- **SQL Injection Prevention** - Parameterized queries via Supabase
- **XSS Protection** - React's built-in escaping
- **Environment Variables** - Sensitive data in env vars

### Performance Optimizations
- **Code Splitting** - Lazy loading for routes
- **Memoization** - React.memo for expensive components
- **Virtual Scrolling** - Efficient large list rendering
- **Image Optimization** - Lazy loading and compression

### Error Handling
```typescript
// Comprehensive error boundaries
try {
  await apiCall();
} catch (error) {
  console.error('Operation failed:', error);
  toast.error('Something went wrong');
}
```

## Development Workflow

### Local Development Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd <project-name>

# 2. Install dependencies
npm install

# 3. Environment setup
cp .env.example .env
# Add your Supabase credentials

# 4. Start development server
npm run dev
```

### Available Scripts
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
}
```

### Code Standards
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code linting and formatting
- **Component Structure** - Consistent file organization
- **Naming Conventions** - PascalCase for components, camelCase for functions

### Testing Strategy
- **Component Testing** - Unit tests for individual components
- **Integration Testing** - End-to-end user workflows
- **Performance Testing** - Load testing for chat functionality

## Deployment

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Platforms
- **Lovable Platform** - Primary deployment method
- **Vercel** - Alternative static hosting
- **Netlify** - Alternative static hosting
- **Custom Domain** - Configure via Lovable dashboard

### Environment Configuration
```bash
# Production environment variables
VITE_SUPABASE_URL=your-production-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-production-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Performance Monitoring
- **Build Analysis** - Bundle size optimization
- **Runtime Monitoring** - Error tracking and analytics
- **User Experience** - Performance metrics and monitoring

---

*This documentation is maintained alongside the codebase. For the latest updates, refer to the code comments and commit history.*