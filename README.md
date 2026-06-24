# CERANOS AI Chat

AI-powered chat application with multi-model support.

## What is this?

CERANOS is a chat interface that lets you talk to different AI models from one place. Instead of switching between ChatGPT, Claude, and other AI tools, you get a single clean interface that connects to multiple providers. Built with React and backed by Supabase for user accounts and conversation history.

## Features

- Chat with multiple AI models from one interface
- Conversation history saved to your account
- User authentication and account management
- Clean, modern UI with dark and light mode
- Responsive design for desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + TypeScript + Vite |
| **UI** | shadcn/ui, Radix UI primitives |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase (auth, database, storage) |

## Getting Started

```bash
git clone https://github.com/deb-pradhan/ceranos-ai-chat.git
cd ceranos-ai-chat
npm install
npm run dev
```

You'll need a [Supabase](https://supabase.com) project for authentication and data storage. Configure your Supabase URL and keys in the environment.

## License

MIT
