# Deployment Guide

Your Course Management System is ready to deploy! Here are the easiest options:

## Option 1: Deploy to Vercel (Recommended - Easiest)

### Method A: Using Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts. Your app will be live in seconds!

### Method B: Using Vercel Website
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect Vite and deploy automatically

## Option 2: Deploy to Netlify

### Method A: Using Netlify CLI
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Method B: Using Netlify Website
1. Go to [netlify.com](https://netlify.com)
2. Sign up/login
3. Drag and drop your `dist` folder (after running `npm run build`)
4. Or connect your Git repository for continuous deployment

## Option 3: Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Option 4: Deploy to Any Static Host

After running `npm run build`, upload the `dist` folder to:
- AWS S3 + CloudFront
- Firebase Hosting
- Azure Static Web Apps
- Any static hosting service

## Important Notes

- **Data Persistence**: This app uses localStorage, so data is stored in the user's browser
- **No Backend Required**: This is a fully client-side application
- **Build Output**: The `dist` folder contains all files needed for deployment

## Quick Deploy Commands

### Vercel (Fastest)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Your app is production-ready! 🚀

