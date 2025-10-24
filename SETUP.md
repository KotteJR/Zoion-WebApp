# Zoion Setup Guide

This guide will help you set up and run the Zoion web application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd zoion-zoion-mobile-3e7a41e752a6
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

This will install all required packages including Next.js, React, Apollo Client, AWS Amplify, and others.

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Then edit `.env.local` with your actual credentials:

```env
# GraphQL API Configuration
NEXT_PUBLIC_GRAPHQL_HTTP_URL=https://api.zoion.biz/v1/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=wss://api.zoion.biz/v1/graphql

# AWS Cognito Configuration
NEXT_PUBLIC_AWS_REGION=eu-north-1
NEXT_PUBLIC_AWS_USER_POOL_ID=your_actual_pool_id
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=your_actual_client_id

# Lambda Function URL (if needed)
NEXT_PUBLIC_API_LAMBDA_URL=your_lambda_url

# Environment
NEXT_PUBLIC_ENVIRONMENT=production
```

**Important**: Replace the placeholder values with your actual AWS Cognito credentials.

### 4. Verify Assets

Ensure all required assets are in place:

- `/public/assets/icons/` - Contains all UI icons
- `/public/assets/breeds/` - Contains breed images
- `/public/assets/images/` - Contains other images

If you're missing assets from the original Flutter project, copy them to the appropriate directories.

### 5. Run the Development Server

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

### 6. Test the Application

1. **Open your browser** and navigate to `http://localhost:3000`
2. You should see the **splash screen** followed by a redirect to the login page
3. Try **creating a new account**:
   - Click "Sign Up"
   - Fill in your details
   - Verify your email with the code sent by AWS Cognito
4. **Log in** with your credentials
5. Explore the app features:
   - Browse the home feed
   - Search for pets
   - View your profile

## Common Issues and Solutions

### Issue: Module not found errors

**Solution**: Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: AWS Amplify configuration errors

**Solution**: Double-check your `.env.local` file and ensure:
- All AWS Cognito credentials are correct
- The user pool is in the correct region
- The client ID matches your Cognito app client

### Issue: GraphQL connection errors

**Solution**: Verify that:
- The GraphQL endpoint URLs are correct
- Your backend Hasura instance is running
- You have proper network connectivity

### Issue: Images not loading

**Solution**: 
- Ensure images are in `/public/assets/` directories
- Check that image paths in the code match actual file locations
- For external images, verify CORS settings

## Building for Production

### 1. Create a production build:

```bash
npm run build
```

### 2. Test the production build locally:

```bash
npm start
```

### 3. Deploy to hosting platform

**For Vercel** (recommended):
```bash
npm install -g vercel
vercel
```

**For other platforms**:
- Build the app with `npm run build`
- Upload the `.next` folder and other required files
- Configure environment variables on your hosting platform

## Project Structure Overview

```
zoion-zoion-mobile-3e7a41e752a6/
├── public/              # Static assets
│   └── assets/         # Images, icons, fonts
├── src/
│   ├── app/            # Next.js pages and routes
│   ├── components/     # React components
│   ├── lib/            # Core libraries and configs
│   ├── store/          # State management
│   ├── types/          # TypeScript types
│   ├── utils/          # Helper functions
│   └── i18n/           # Internationalization
├── .env.local          # Environment variables (create this)
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies
```

## Development Tips

1. **Hot Reload**: The dev server automatically reloads when you make changes
2. **Type Checking**: Run `npm run type-check` to check for TypeScript errors
3. **Linting**: Run `npm run lint` to check code quality
4. **Console Logs**: Check browser console for any runtime errors

## Next Steps

After successful setup:

1. Customize the branding (colors, logo, etc.) in `tailwind.config.js`
2. Add your breed images to `/public/assets/breeds/`
3. Configure any additional AWS services if needed
4. Set up your production environment
5. Deploy to your preferred hosting platform

## Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Review the terminal output for server-side errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are properly installed
5. Check the README.md for additional documentation

## Important Notes

- **Security**: Never commit `.env.local` to version control
- **API Keys**: Keep your AWS credentials secure
- **Assets**: Ensure you have proper licenses for all images and icons
- **Testing**: Test thoroughly before deploying to production

---

Happy coding! 🚀


