# 🥗 NutriSaarthi

> Your AI-Powered Nutrition Partner

NutriSaarthi is a full-stack MERN application for tracking nutrition, planning meals, and achieving health goals with personalized AI recommendations.

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-20.x-brightgreen)
![React](https://img.shields.io/badge/react-18.x-blue)
![MongoDB](https://img.shields.io/badge/mongodb-7.x-green)

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** - JWT with refresh tokens, rate limiting
- 🍽️ **Meal Tracking** - Log meals with full nutrition data
- 💧 **Water Intake** - Track daily hydration with visual progress
- 📅 **Meal Planning** - Plan weekly meals with calendar view
- 📊 **Progress Tracking** - Weight trends, calorie analytics, streak tracking
- 🤖 **AI Recommendations** - Personalized nutrition suggestions

### Technical Features
- 🎨 **Dark/Light Theme** - Beautiful UI with theme toggle
- 📱 **PWA Support** - Install as mobile app, offline support
- ⚡ **Performance Optimized** - Virtualized lists, API caching
- 🔒 **Security Hardened** - Rate limiting, input sanitization, helmet
- 🧪 **Tested** - Jest (backend) + Vitest (frontend)
- 🐳 **Docker Ready** - Production-ready containers

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Zustand (state management)
- React Router v6
- Framer Motion (animations)
- Recharts (data visualization)
- TanStack Virtual (virtualization)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Redis (caching)
- Express Rate Limit
- Express Validator

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 7+
- Redis (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nutrisaarthi.git
cd nutrisaarthi
```

2. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Configure environment**
```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your values

# Client
cp client/.env.example client/.env
```

4. **Start development servers**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

5. **Open browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
nutrisaarthi/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── __tests__/      # Frontend tests
│   ├── public/             # Static assets
│   └── vite.config.ts      # Vite configuration
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/         # Database & Redis config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
│
├── .github/
│   └── workflows/          # CI/CD pipelines
│
├── Dockerfile              # Production Docker build
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
└── nginx.conf              # Nginx configuration
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nutrisaarthi
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:5173
USDA_API_KEY=your-usda-api-key
```

#### Client (.env)
```env
VITE_API_URL=/api
```

## 🐳 Docker Deployment

### Development
```bash
# Start MongoDB and Redis
docker-compose -f docker-compose.dev.yml up -d

# Access Mongo Express at http://localhost:8081
```

### Production
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f api
```

## 🧪 Testing

### Backend Tests (Jest)
```bash
cd server
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Tests (Vitest)
```bash
cd client
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # Coverage report
```

## 📱 PWA Installation

NutriSaarthi is a Progressive Web App! You can install it on your device:

1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Enjoy the native-like experience!

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Meals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meals` | Get all meals |
| POST | `/api/meals` | Create meal |
| PUT | `/api/meals/:id` | Update meal |
| DELETE | `/api/meals/:id` | Delete meal |

### Water
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/water/today` | Get today's intake |
| POST | `/api/water` | Log water |
| DELETE | `/api/water/:id` | Remove entry |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get dashboard data |
| GET | `/api/dashboard/trends` | Get trends |
| GET | `/api/dashboard/progress` | Get progress |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [USDA FoodData Central](https://fdc.nal.usda.gov/) for nutrition data
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<p align="center">
  Made with ❤️ by the NutriSaarthi Team
</p>
