# Deployment Guide

Your AI Design Debt Calculator is now on GitHub and ready to deploy!

## GitHub Repository

✅ **Successfully pushed to:** https://github.com/krishnanihar/AI-Design-Debt-Calculator-

## Quick Deploy Options

### Option 1: Vercel (Recommended - 2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Paste: `https://github.com/krishnanihar/AI-Design-Debt-Calculator-`
4. Click "Import" → "Deploy"
5. Done! You'll get a URL like: `your-project.vercel.app`

**Why Vercel:**
- Automatic deployments on every push
- Free tier is generous
- Built for React/Vite apps
- Zero configuration needed

### Option 2: Netlify (3 minutes)

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub
4. Select `AI-Design-Debt-Calculator-`
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"

### Option 3: GitHub Pages (5 minutes)

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/AI-Design-Debt-Calculator-/',
     // ... rest of config
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable Pages in GitHub Settings → Pages → Source: gh-pages branch

6. URL: `https://krishnanihar.github.io/AI-Design-Debt-Calculator-/`

## Environment Variables

No environment variables needed for MVP! Everything runs client-side.

For Phase 2 (Figma Integration), you'll need:
- `VITE_FIGMA_API_KEY`

## Custom Domain (Optional)

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS settings as instructed

### For Netlify:
1. Go to Domain Settings
2. Add custom domain
3. Follow DNS configuration steps

## Performance Tips

Your app is already optimized, but for production:

1. **Enable Gzip** (automatic on Vercel/Netlify)
2. **Add Analytics** (optional):
   ```bash
   npm install @vercel/analytics
   ```

3. **Monitor Bundle Size**:
   ```bash
   npm run build
   # Check the output - current: ~557KB (167KB gzipped)
   ```

## Continuous Deployment

Once deployed on Vercel or Netlify:
- Every push to `main` auto-deploys
- Preview deployments for PRs
- Instant rollbacks if needed

## Testing Production Build Locally

Before deploying:
```bash
npm run build
npm run preview
```

Open http://localhost:4173 to test production build.

## Post-Deployment Checklist

- [ ] Test all 4 tabs (Quick Analysis, Components, Heatmap, Report)
- [ ] Verify export functionality works
- [ ] Test on mobile device
- [ ] Check all 8 sample components load
- [ ] Share URL with stakeholders

## Monitoring

Free monitoring options:
- **Vercel Analytics** - Built-in with Vercel
- **Google Analytics** - Add tracking code
- **Sentry** - Error tracking (for production)

## Next Steps

1. Deploy to Vercel (recommended)
2. Share the live URL
3. Gather feedback
4. Iterate on Phase 2 features

## Support

- Repository: https://github.com/krishnanihar/AI-Design-Debt-Calculator-
- Issues: https://github.com/krishnanihar/AI-Design-Debt-Calculator-/issues

---

**Current Status:**
✅ Code pushed to GitHub
✅ Production build tested
✅ Ready for deployment
🚀 Deploy to Vercel in < 2 minutes!
