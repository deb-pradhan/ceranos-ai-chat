# Brownstone Research AI Chat - Local Setup Guide

Complete step-by-step guide to set up and run the project locally.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Environment Configuration](#environment-configuration)
- [Development Tools](#development-tools)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software

1. **Node.js & npm**
   - Version: Node.js 18.x or higher
   - Check version: `node --version`
   - Install via [nvm (recommended)](https://github.com/nvm-sh/nvm#installing-and-updating):
     ```bash
     # Install nvm
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     
     # Install Node.js LTS
     nvm install --lts
     nvm use --lts
     ```
   - Or download from [nodejs.org](https://nodejs.org/)

2. **Git**
   - Version: Latest stable version
   - Check version: `git --version`
   - Download from [git-scm.com](https://git-scm.com/)

3. **Code Editor** (recommended)
   - [Visual Studio Code](https://code.visualstudio.com/)
   - [WebStorm](https://www.jetbrains.com/webstorm/)
   - Or any editor of your choice

### Optional but Recommended

4. **Supabase CLI** (for database management)
   ```bash
   npm install -g supabase
   ```

5. **VS Code Extensions** (if using VS Code)
   - ESLint
   - Prettier - Code formatter
   - Tailwind CSS IntelliSense
   - GitLens
   - TypeScript Vue Plugin (Volar)

## Quick Start

For experienced developers who want to get started quickly:

```bash
# Clone the repository
git clone https://github.com/your-username/brownstone-research-chat.git
cd brownstone-research-chat

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Supabase credentials to .env
# Then start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Detailed Setup

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-username/brownstone-research-chat.git

# Or clone via SSH (if you have SSH keys configured)
git clone git@github.com:your-username/brownstone-research-chat.git

# Navigate to project directory
cd brownstone-research-chat
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install

# This will install:
# - React & React DOM
# - TypeScript
# - Vite (build tool)
# - Tailwind CSS
# - shadcn/ui components
# - Supabase client
# - TanStack Query
# - And all other dependencies listed in package.json
```

**Expected output:**
```
added XXX packages in XXs
```

### Step 3: Environment Configuration

#### Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

If `.env.example` doesn't exist, create `.env` manually:

```bash
touch .env
```

#### Configure Supabase Credentials

Open `.env` in your code editor and add your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

#### Where to Find Supabase Credentials

1. **Create a Supabase Account** (if you haven't already)
   - Visit [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with GitHub or email

2. **Create a New Project**
   - Click "New Project"
   - Choose organization
   - Enter project name
   - Set database password (save this securely!)
   - Select region (choose closest to your users)
   - Click "Create new project"

3. **Get Your Credentials**
   - In Supabase Dashboard, go to **Settings** → **API**
   - Copy the following:
     - **Project URL** → `VITE_SUPABASE_URL`
     - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Project ID is in your URL: `https://app.supabase.com/project/[PROJECT_ID]`

### Step 4: Database Setup

#### Option A: Using Supabase Dashboard

1. In Supabase Dashboard, go to **SQL Editor**
2. Run the migration files from `supabase/migrations/` in order
3. Verify tables are created in **Database** → **Tables**

#### Option B: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Push migrations
supabase db push
```

#### Verify Database Setup

Check that these tables exist:
- `profiles`
- `chats`
- `messages`

### Step 5: Start Development Server

```bash
# Start the development server
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.x.x:8080/
  ➜  press h + enter to show help
```

### Step 6: Access the Application

1. Open your browser
2. Navigate to `http://localhost:8080`
3. You should see the Brownstone Research AI Chat interface

## Environment Configuration

### Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes | `https://abcdef.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anon key | Yes | `eyJhbGci...` |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier | Yes | `abcdefghijklmnop` |

### Security Notes

⚠️ **Important Security Practices:**

- Never commit `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use different credentials for development and production
- Rotate keys if accidentally exposed
- Use Supabase Row Level Security (RLS) policies for data protection

## Development Tools

### Available npm Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint

# Type check TypeScript files
npm run type-check
```

### Development Server Features

- **Hot Module Replacement (HMR)** - Instant updates without full page reload
- **Fast Refresh** - Preserves component state during edits
- **TypeScript Support** - Real-time type checking
- **Auto Port Assignment** - Uses port 8080 by default

### Browser DevTools

#### Recommended Chrome Extensions
- React Developer Tools
- Redux DevTools (for state inspection)
- Lighthouse (for performance auditing)

#### Debugging Tips

**Console Logging:**
```typescript
// Add console.logs for debugging
console.log('User data:', user);
console.log('Message sent:', message);
```

**React DevTools:**
- Inspect component props and state
- View component hierarchy
- Profile performance

**Network Tab:**
- Monitor API calls to Supabase
- Check authentication headers
- Debug streaming responses

## Project Structure Overview

```
brownstone-research-chat/
├── src/                    # Source code
│   ├── assets/            # Images, fonts, static files
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── chat/         # Chat interface components
│   │   ├── sidebar/      # Sidebar components
│   │   └── ui/           # shadcn/ui components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # Third-party integrations
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── utils/            # Helper utilities
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── supabase/              # Supabase configuration
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
├── public/               # Public static files
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── README.md             # Project overview
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Port 8080 already in use

**Solution 1: Use different port**
```bash
# Set port in vite.config.ts or use environment variable
PORT=3000 npm run dev
```

**Solution 2: Kill process using port 8080**
```bash
# On macOS/Linux
lsof -ti:8080 | xargs kill -9

# On Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

#### Issue: Supabase connection error

**Symptoms:**
- "Failed to fetch" errors
- Authentication not working
- Database queries failing

**Solution:**
1. Verify `.env` credentials are correct
2. Check Supabase project status in dashboard
3. Ensure project is not paused (free tier pauses after inactivity)
4. Verify API keys haven't been rotated
5. Check browser console for specific error messages

```bash
# Test Supabase connection
curl https://your-project.supabase.co/rest/v1/
```

#### Issue: TypeScript errors

**Solution:**
```bash
# Run type checker
npm run type-check

# Common fixes:
# 1. Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
# 2. Delete and regenerate types
rm -rf node_modules/.vite
npm run dev
```

#### Issue: Styling not appearing correctly

**Solution:**
1. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
2. Check if Tailwind CSS is working:
   ```tsx
   <div className="bg-red-500">Test</div>
   ```
3. Verify `index.css` is imported in `main.tsx`
4. Check browser console for CSS errors

#### Issue: Hot reload not working

**Solution:**
```bash
# 1. Restart dev server
# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Check file watchers limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Getting Help

If you're still experiencing issues:

1. **Check the documentation:**
   - [Project Documentation](./Project-Documentation.md)
   - [Supabase Docs](https://supabase.com/docs)
   - [Vite Docs](https://vitejs.dev)
   - [React Docs](https://react.dev)

2. **Search existing issues:**
   - GitHub Issues
   - Stack Overflow
   - Supabase Discord

3. **Ask for help:**
   - Create a GitHub issue with:
     - Description of the problem
     - Steps to reproduce
     - Error messages/screenshots
     - Environment details (OS, Node version, etc.)

## Development Best Practices

### Code Style

- Follow TypeScript best practices
- Use ESLint recommendations
- Maintain consistent formatting
- Write descriptive variable names
- Add comments for complex logic

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Commit Message Convention

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Testing Changes

Before committing:
1. Test in browser (localhost:8080)
2. Check browser console for errors
3. Test authentication flow
4. Test chat functionality
5. Verify responsive design (mobile/desktop)
6. Run linter: `npm run lint`

## Additional Resources

### Documentation Links

- **Project Documentation:** [Project-Documentation.md](./Project-Documentation.md)
- **Lovable Platform:** [docs.lovable.dev](https://docs.lovable.dev)
- **React:** [react.dev](https://react.dev)
- **TypeScript:** [typescriptlang.org](https://www.typescriptlang.org/docs/)
- **Vite:** [vitejs.dev](https://vitejs.dev/guide/)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com/docs)
- **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **TanStack Query:** [tanstack.com/query](https://tanstack.com/query/latest)

### Learning Resources

**React & TypeScript:**
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

**Tailwind CSS:**
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/utility-first)
- [Tailwind UI Components](https://tailwindui.com/)

**Supabase:**
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Video Tutorials

- [React Full Course](https://www.youtube.com/watch?v=bMknfKXIFA8)
- [TypeScript Course](https://www.youtube.com/watch?v=BwuLxPH8IDs)
- [Tailwind CSS Tutorial](https://www.youtube.com/watch?v=UBOj6rqRUME)
- [Supabase Full Course](https://www.youtube.com/watch?v=7uKQBl9uZ00)

### Community

- **Lovable Discord:** [discord.gg/lovable](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Supabase Discord:** [discord.supabase.com](https://discord.supabase.com)
- **React Community:** [react.dev/community](https://react.dev/community)

---

## Next Steps

After completing the setup:

1. **Explore the codebase**
   - Read through [Project-Documentation.md](./Project-Documentation.md)
   - Understand the component structure
   - Review the authentication flow

2. **Make your first change**
   - Update a text string
   - Change a color in the theme
   - Add a console.log to see data flow

3. **Test authentication**
   - Set up Google OAuth in Supabase
   - Test login/logout flow
   - Verify user session persistence

4. **Build a feature**
   - Start with something small
   - Follow the existing patterns
   - Test thoroughly
   - Create a pull request

## Support

For project-specific questions:
- Create an issue on GitHub
- Contact the development team
- Check the [Project Documentation](./Project-Documentation.md)

For general web development questions:
- [Stack Overflow](https://stackoverflow.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev](https://web.dev/)

---

**Happy coding! 🚀**

*Last updated: 2025-10-16*
