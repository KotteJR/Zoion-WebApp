# Zoion - Pet Breeding Social Network

Zoion is a modern web platform built with Next.js that helps pet owners and breeders connect, find breeding partners, and manage their pets' profiles. Originally a Flutter mobile app, it has been completely rebuilt as a responsive web application.

## Features

- **User Authentication** - Secure login/registration with AWS Cognito
- **Pet Profiles** - Detailed profiles for pets including images, breed info, medical records, and competitions
- **Search & Discovery** - Advanced search filters to find the perfect breeding partner
- **Social Feed** - Browse pets ready for breeding, favorites, and personalized recommendations
- **Family Tree** - Visual pedigree charts showing pet lineage
- **Breeder Profiles** - Connect with certified breeders and kennels
- **Trophy Showcase** - Display competition wins and achievements
- **Favorites** - Save and track interesting pets
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Authentication**: AWS Amplify + Cognito
- **API**: GraphQL with Apollo Client
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Database**: Hasura GraphQL (backend)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- An AWS Cognito user pool
- Access to the Hasura GraphQL API

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zoion-zoion-mobile-3e7a41e752a6
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add the following variables (use `env.example` as a template):

```env
# GraphQL API Configuration
NEXT_PUBLIC_GRAPHQL_HTTP_URL=https://api.zoion.biz/v1/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=wss://api.zoion.biz/v1/graphql

# AWS Cognito Configuration
NEXT_PUBLIC_AWS_REGION=eu-north-1
NEXT_PUBLIC_AWS_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=your_client_id

# Lambda Function URL
NEXT_PUBLIC_API_LAMBDA_URL=your_lambda_url

# Environment
NEXT_PUBLIC_ENVIRONMENT=production
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages (login, register, etc.)
│   ├── home/              # Home feed
│   ├── search/            # Search and results pages
│   ├── profile/           # User profile
│   ├── pet/               # Pet profile and related pages
│   ├── breeder/           # Breeder profile pages
│   ├── settings/          # Settings pages
│   └── page.tsx           # Splash/landing page
├── components/            # Reusable React components
│   ├── layout/           # Layout components (nav bars, etc.)
│   ├── pet/              # Pet-related components
│   └── ui/               # UI components (buttons, inputs, etc.)
├── lib/                   # Core functionality
│   ├── graphql/          # GraphQL queries, mutations, subscriptions
│   ├── apollo-client.ts  # Apollo Client configuration
│   └── amplify-config.ts # AWS Amplify configuration
├── store/                 # Zustand state management stores
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Key Pages

- `/` - Splash screen and initial routing
- `/auth/login` - User login
- `/auth/register` - User registration
- `/home` - Main feed with pet recommendations
- `/search` - Advanced pet search
- `/profile` - User's own profile
- `/pet/[id]` - Individual pet profile
- `/pet/[id]/family-tree` - Pet pedigree visualization
- `/breeder/[id]` - Breeder profile
- `/settings` - User settings

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Authentication Flow

1. Users sign up with email and password through AWS Cognito
2. Email verification is required via confirmation code
3. JWT tokens are stored and used for GraphQL API authentication
4. Session persistence across page refreshes

## GraphQL API

The app connects to a Hasura GraphQL backend with the following main entities:

- **Users** - User accounts and profiles
- **Pets** - Pet profiles with full details
- **Breeds** - Dog breed information
- **Competitions** - Competition/trophy records
- **Favorites** - User's favorite pets
- **Images** - Pet images

## Development Notes

### Assets

Pet breed icons and other images are located in the `/public/assets` directory. The app expects:
- Breed icons in `/assets/breeds/`
- UI icons in `/assets/icons/`
- Images in `/assets/images/`

### State Management

- **Auth State** - `useAuthStore()` manages user authentication state
- **Search State** - `useSearchStore()` manages search filters

### Responsive Design

The app uses Tailwind CSS with custom breakpoints for responsive layouts:
- Mobile-first approach
- Tablet optimization at `md:` breakpoint
- Desktop layouts at `lg:` and above

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your hosting platform (Vercel, AWS, etc.)

For Vercel (recommended for Next.js):
```bash
npm install -g vercel
vercel
```

Make sure to add all environment variables to your hosting platform's configuration.

## Contributing

This is a private project. For any questions or issues, please contact the development team.

## License

Proprietary - All rights reserved

## Contact

For support or inquiries, please reach out to the Zoion team.

---

**Note**: This project was migrated from a Flutter mobile application to a Next.js web platform, maintaining all core functionality while optimizing for web browsers and responsive design.
# zoionwebapptest
