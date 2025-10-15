# AI Design Debt Calculator - Setup Guide

A professional tool for quantifying component readiness before AI integration. This guide will help you set up the full production version with authentication and persistent data storage.

## Features

### Current Features (v0.2)
- **Authentication**: Google OAuth via Supabase Auth
- **Project Management**: Create and manage multiple design system projects
- **Component Analysis**: Add components manually with comprehensive AI readiness metrics
- **5 AI Readiness Dimensions**:
  - Streaming Readiness (25% weight)
  - Confidence Handling (20% weight)
  - Error Handling (25% weight)
  - Dynamic Content (15% weight)
  - Interaction Patterns (15% weight)
- **Component Templates**: Start from pre-configured templates (Button, Modal, Card, etc.)
- **Visual Analysis**: Heatmaps, component breakdowns, and executive reports
- **Persistent Storage**: All data saved to Supabase with real-time sync
- **Optimistic Updates**: Instant UI updates with automatic rollback on errors
- **Demo Mode**: Works without backend for quick exploration

### Coming Soon
- CSV/JSON bulk import
- Figma component import
- Historical tracking and comparisons
- Team collaboration features
- Dependency visualization

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier works great)
- Google Cloud Console project (for OAuth)

### Installation

#### 1. Clone and Install Dependencies

```bash
cd ai-design-debt-calculator
npm install
```

#### 2. Set Up Supabase

**a. Create a new project**
- Go to [supabase.com](https://supabase.com)
- Click "New Project"
- Choose your organization
- Enter project name, database password, and region
- Wait for project to be ready (~2 minutes)

**b. Run the database schema**
- Go to your Supabase project dashboard
- Navigate to the SQL Editor (left sidebar)
- Click "New Query"
- Copy the entire contents of `supabase-schema.sql`
- Paste into the SQL editor
- Click "Run" or press Cmd/Ctrl + Enter
- You should see "Success. No rows returned"

**c. Verify tables were created**
- Go to "Table Editor" in the sidebar
- You should see tables: `users`, `projects`, `components`, `project_shares`, `analysis_snapshots`

**d. Get your Supabase credentials**
- Go to Settings → API
- Copy your "Project URL" (looks like: `https://xxxxx.supabase.co`)
- Copy your "anon public" key

#### 3. Set Up Google OAuth

**a. Create Google Cloud project**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create a new project or select an existing one
- Name it "AI Design Debt Calculator" or similar

**b. Enable required APIs**
- In the Cloud Console, go to "APIs & Services" → "Library"
- Search for "Google+ API"
- Click "Enable"

**c. Configure OAuth consent screen**
- Go to "APIs & Services" → "OAuth consent screen"
- Choose "External" (unless you have a Google Workspace)
- Click "Create"
- Fill in required fields:
  - App name: "AI Design Debt Calculator"
  - User support email: your email
  - Developer contact: your email
- Click "Save and Continue"
- Scopes: Click "Add or Remove Scopes"
  - Add: `openid`, `profile`, `email`
- Click "Save and Continue"
- Test users: Add your email (during development)
- Click "Save and Continue"

**d. Create OAuth 2.0 credentials**
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth 2.0 Client ID"
- Application type: "Web application"
- Name: "AI Design Debt Calculator"
- Authorized JavaScript origins:
  - Add: `http://localhost:5173` (for development)
  - Add: Your production URL (when deploying)
- Authorized redirect URIs:
  - Add: `https://<your-project-id>.supabase.co/auth/v1/callback`
  - Replace `<your-project-id>` with your actual Supabase project ID
  - Also add: `http://localhost:54321/auth/v1/callback` (if using local Supabase)
- Click "Create"
- Copy your Client ID and Client Secret

**e. Add Google OAuth to Supabase**
- Go back to Supabase Dashboard
- Navigate to Authentication → Providers
- Find "Google" and click to expand
- Toggle "Enable Sign in with Google"
- Paste your Google Client ID
- Paste your Google Client Secret
- Click "Save"

#### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Where to find these:**
- Supabase Dashboard → Settings → API
- Copy "Project URL" → `VITE_SUPABASE_URL`
- Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`

#### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

You should see the login page. Click "Sign In with Google" to test!

### Demo Mode

Want to try it without setting up the backend?

1. Skip steps 2-4 above
2. Just run `npm run dev`
3. The app will automatically run in demo mode
4. You'll see sample data and "Demo Mode" in the header
5. Perfect for exploring the interface!

## Usage Guide

### Creating Your First Project

1. **Sign in** with Google (top right corner)
2. **Create a project**:
   - Click the "Select Project" dropdown (top right)
   - Click "+ Create New Project"
   - Enter project name (e.g., "Enterprise Design System 2024")
   - Add optional description
   - Click "Create Project"
3. Your new project is now selected and ready!

### Adding Components

#### Method 1: Using Templates (Fastest)

1. Go to the "Components" tab
2. Click "Add Component" button
3. Select a template (Button, Modal, Card, etc.)
4. Adjust the pre-filled metrics if needed
5. Fill in:
   - Component name
   - Number of instances
   - Team name
6. Click "Add Component"

#### Method 2: Manual Entry (Most Accurate)

1. Go to the "Components" tab
2. Click "Add Component" button
3. Fill in basic information:
   - **Name**: Your component name (e.g., "PrimaryButton")
   - **Type**: Interactive, Display, Input, Layout, or Feedback
   - **Instances**: How many times it's used in your app
   - **Team**: Which team owns it
   - **Dependencies**: Other components it uses (comma-separated)

4. Configure AI Readiness Metrics:

   **Streaming Readiness**
   - ☑️ Has Fixed Height (negative - uncheck if dynamic)
   - ☑️ Has Overflow Handling (check if scrollable)
   - ☑️ Supports Streaming (check if can show progressive content)
   - ☑️ Has Progressive Render (check if shows skeleton/loading states)

   **Confidence Handling**
   - ☑️ Has Confidence Indicators (check if shows AI confidence scores)
   - ☑️ Has Hallucination Detection (check if warns about low confidence)
   - ☑️ Has Ambiguity States (check if handles unclear AI responses)
   - ☑️ Has Verification Badges (check if shows verified/unverified badges)

   **Error Handling**
   - ☑️ Has Graceful Degradation (check if shows partial results on failure)
   - ☑️ Has Timeout Handling (check if handles slow AI responses)
   - ☑️ Has Circuit Breaker (check if stops retrying after multiple failures)
   - ☑️ Has Human Handoff (check if can escalate to human support)
   - **Error State Count**: Number of different error states (5+ recommended)

   **Dynamic Content**
   - ☑️ Handles Variable Length (check if works with 50 or 5000 tokens)
   - ☑️ Supports Multi-Modal (check if handles text, images, code, tables)
   - ☑️ Has Token Limit Management (check if shows token usage warnings)
   - ☑️ Supports Content Switching (check if can change content types dynamically)

   **Interaction Patterns**
   - ☑️ Has Intent Construction (check if helps build AI prompts)
   - ☑️ Has Refinement Journey (check if allows iterative improvement)
   - ☑️ Has Contextual Actions (check if suggests relevant actions)
   - ☑️ Has Feedback Loops (check if allows thumbs up/down, reporting)

5. Click "Add Component"

### Understanding Your Results

#### Quick Analysis Tab
- Enter a component name and key metrics
- Get instant debt score
- See top 5 issues to fix

#### Components Tab
- See all your components in a grid
- Sort by severity (Critical → Low)
- Search by name
- Click any component for detailed breakdown

#### Heatmap Tab
- Visual grid of all components
- Color-coded by severity
- Quickly spot high-risk areas
- See which teams have the most debt

#### Report Tab
- Executive summary with total debt
- Severity distribution
- Estimated remediation time
- Top issues across all components
- Strategic recommendations

### Interpreting Scores

**Debt Score** (0-100, lower is better)
- **0-20**: ✅ Low debt - AI ready
- **21-40**: ⚠️ Medium debt - needs work before AI launch
- **41-60**: ⚠️ High debt - major refactoring required
- **61-100**: 🚫 Critical debt - not safe for AI integration

**Severity Badges**
- **Critical** (red): Will break in production - fix immediately
- **High** (orange): Major issues - fix before AI launch
- **Medium** (yellow): Degraded experience - plan remediation
- **Low** (green): Minor issues - fix opportunistically

**Remediation Effort**
- Measured in story points
- Based on industry averages
- Includes all identified issues
- Use for sprint planning

## Troubleshooting

### "Demo Mode" is showing but I set up Supabase

**Problem**: Environment variables not loaded

**Solution**:
1. Make sure `.env` file is in the root directory
2. Check that variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart the dev server (`Ctrl+C` then `npm run dev`)
4. Hard refresh your browser (`Cmd/Ctrl + Shift + R`)

### Google login button does nothing

**Problem**: OAuth not configured correctly

**Solution**:
1. Check your redirect URI in Google Cloud Console matches Supabase exactly
2. Make sure Google Provider is enabled in Supabase (Authentication → Providers)
3. Check browser console for errors (F12)
4. Try the Supabase dashboard login test: Authentication → Providers → Google → "Test"

### "Failed to create project" error

**Problem**: Row Level Security or database permissions

**Solution**:
1. Make sure you ran the ENTIRE `supabase-schema.sql` script
2. Check Supabase logs: Logs → Postgres Logs
3. Verify your user was created: Table Editor → users (should have your email)
4. Try signing out and back in

### Components not saving

**Problem**: RLS policies or network issues

**Solution**:
1. Open browser DevTools (F12) → Network tab
2. Try adding a component
3. Look for failed requests (red)
4. Check the response for error messages
5. Verify you have a project selected (dropdown shows project name, not "Select Project")

### Build errors

**Problem**: TypeScript or dependency issues

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building
npm run build
```

## Deployment

### Deploying to Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel auto-detects Vite configuration

3. **Add environment variables**
   - In Vercel project settings → Environment Variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
   - Apply to Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - You'll get a URL like `your-app.vercel.app`

5. **Update OAuth settings**
   - Add Vercel URL to Google Cloud Console authorized origins
   - Add `https://your-app.vercel.app` to authorized JavaScript origins
   - Add Supabase callback URL for this domain
   - Update Supabase Auth → Site URL to your Vercel URL

### Deploying to Other Platforms

The app is a static site (after build) and can be deployed anywhere:

**Netlify**
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in Netlify UI

**Cloudflare Pages**
- Build command: `npm run build`
- Build output: `dist`
- Add environment variables in Pages settings

**AWS S3 + CloudFront**
- Build locally: `npm run build`
- Upload `dist/` folder to S3
- Configure CloudFront distribution
- Set environment variables during build

## Database Backup

**Export your data** (recommended before major changes):

```sql
-- Run in Supabase SQL Editor
COPY (SELECT * FROM projects) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM components) TO STDOUT WITH CSV HEADER;
```

## Security Notes

- The `anon` key is safe to expose in your frontend code
- Row Level Security (RLS) ensures users can only access their own data
- Never commit your `.env` file to Git
- Rotate keys if accidentally exposed (Supabase Settings → API)

## Support

For issues:
1. Check this guide thoroughly
2. Review `supabase-schema.sql` for database structure
3. Check browser console for errors (F12)
4. Contact the development team with:
   - What you were trying to do
   - What happened instead
   - Browser console errors
   - Supabase logs (if applicable)

## Next Steps

Once you have the app running:

1. **Add your real components**: Start with your most-used components
2. **Run analysis**: Check the Heatmap and Report tabs
3. **Prioritize fixes**: Focus on Critical and High severity first
4. **Track progress**: Re-analyze after making changes
5. **Share with team**: Use the Report tab to generate executive summaries

---

Built with React, TypeScript, Tailwind CSS, Supabase, and Zustand.
