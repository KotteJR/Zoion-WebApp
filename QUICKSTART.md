# 🚀 Zoion Quick Start

Get your Zoion web platform running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- AWS Cognito credentials (user pool ID and client ID)

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```bash
cp env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_GRAPHQL_HTTP_URL=https://api.zoion.biz/v1/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=wss://api.zoion.biz/v1/graphql
NEXT_PUBLIC_AWS_USER_POOL_ID=your_pool_id_here
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_AWS_REGION=eu-north-1
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## First Time Use

1. Click **"Sign Up"**
2. Enter your details
3. Check email for verification code
4. Enter code and verify
5. **Login** with your credentials
6. Start exploring!

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Common Issues

**Problem**: Module not found
```bash
rm -rf node_modules
npm install
```

**Problem**: AWS Cognito errors
- Double check your `.env.local` credentials
- Ensure user pool is active

**Problem**: GraphQL errors
- Verify API endpoint URLs
- Check network connectivity

## Project Structure

```
src/
├── app/          # Pages (Next.js routes)
├── components/   # React components
├── lib/          # GraphQL & config
└── store/        # State management
```

## Key Features

✅ User authentication (login/register)
✅ Pet profiles with images
✅ Search and filter pets
✅ Favorites system
✅ Family tree visualization
✅ Responsive design (mobile/desktop)
✅ English & Swedish support

## Need Help?

- 📖 See [README.md](README.md) for full documentation
- 🔧 See [SETUP.md](SETUP.md) for detailed setup
- 📝 See [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) for migration details

---

**You're all set!** Happy coding! 🎉


