# Crypto Dashboard Frontend

A modern, responsive React frontend for a cryptocurrency dashboard built with Vite, TypeScript, Tailwind CSS, and TanStack Query.

## 🚀 Features

- **Authentication System**: Complete JWT-based login/register with token management
- **Real-time Crypto Data**: Top 10 cryptocurrencies with live price updates
- **Interactive Charts**: Beautiful price charts using Recharts with multiple time ranges
- **AI Chat Assistant**: Natural language queries about crypto markets
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Responsive Design**: Mobile-first design that works on all devices
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Modern UI**: Clean, accessible components with smooth animations

## 🛠 Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React + React Icons
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   ├── dashboard/      # Dashboard-specific components
│   ├── chat/           # Chat assistant components
│   ├── layout/         # Layout components (Header, etc.)
│   └── auth/           # Authentication components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── contexts/           # React contexts (Auth, Theme)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── lib/                # Third-party configurations
└── main.tsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-dashboard-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   The default configuration in `.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=Crypto Dashboard
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### API Integration

The app is configured to work with a backend API at `http://localhost:8000/api`. The following endpoints are expected:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user

#### Crypto Data
- `GET /coins/top` - Get top cryptocurrencies
- `GET /coins/:id` - Get specific coin data
- `GET /coins/:id/price-history` - Get price history
- `GET /coins/market-data` - Get market overview
- `GET /coins/search` - Search coins
- `GET /coins/trending` - Get trending coins
- `GET /coins/gainers-losers` - Get gainers and losers

#### Chat Assistant
- `POST /chat/message` - Send chat message
- `GET /chat/sessions` - Get chat sessions
- `GET /chat/suggestions` - Get chat suggestions

### Backend Requirements

The frontend expects your backend to provide the following endpoints:

#### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user

#### Crypto Data Endpoints
- `GET /coins/top` - Get top cryptocurrencies
- `GET /coins/:id` - Get specific coin data
- `GET /coins/:id/price-history` - Get price history
- `GET /coins/market-data` - Get market overview
- `GET /coins/search` - Search coins
- `GET /coins/trending` - Get trending coins
- `GET /coins/gainers-losers` - Get gainers and losers

#### Chat Assistant Endpoints
- `POST /chat/message` - Send chat message
- `GET /chat/sessions` - Get chat sessions
- `GET /chat/suggestions` - Get chat suggestions

## 🎨 Theming

The app supports both light and dark themes with automatic system preference detection. Theme configuration is in `tailwind.config.js` and theme context in `src/contexts/ThemeContext.tsx`.

### Custom Colors

The app uses a custom color palette defined in Tailwind config:
- Primary colors (blue theme)
- Crypto-specific colors (green for gains, red for losses)
- Dark mode colors

## 📱 Responsive Design

The app is built with a mobile-first approach:
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Responsive grid layouts
- Mobile-optimized navigation
- Touch-friendly interactions

## 🔐 Authentication

The authentication system includes:
- JWT token management with automatic refresh
- Protected routes
- Form validation with Zod schemas
- Error handling and user feedback
- Demo credentials for testing

### Backend Integration
This frontend is designed to work with a backend API running on `http://localhost:8000/api`. Make sure your backend is running and accessible before using the application.

## 📊 Data Management

- **TanStack Query**: For server state management, caching, and synchronization
- **Real-time Updates**: Automatic data refetching with configurable intervals
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton loaders and loading indicators

## 🧪 Development

### Code Quality
- ESLint configuration for code linting
- Prettier for code formatting
- TypeScript for type safety
- Husky for git hooks (optional)

### Testing
The project is set up for testing but test files are not included in this basic setup. You can add:
- Jest for unit testing
- React Testing Library for component testing
- Cypress for E2E testing

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist` directory.

### Environment Variables for Production
Make sure to set the correct API base URL for your production environment:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```