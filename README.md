# 🥗 NutriSaarthi

**Your Intelligent Nutrition Companion**

A full-stack MERN application designed to help users track their nutrition, log meals, and receive AI-powered dietary recommendations based on their health goals.

![NutriSaarthi](https://img.shields.io/badge/NutriSaarthi-Nutrition%20Tracking-22c55e?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyeiIvPjwvc3ZnPg==)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🚀 Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library with TypeScript |
| **Vite** | Next-gen build tool |
| **React Router 6** | Client-side routing |
| **Zustand** | Lightweight state management |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Data visualization |
| **Axios** | HTTP client |
| **Lucide React** | Beautiful icons |

### Backend (`/server`)
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Express Validator** | Input validation |

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication with token persistence
- Protected routes and API endpoints

### 📊 Dashboard
- Real-time calorie and macro tracking
- Interactive weekly charts
- Progress indicators for daily goals
- AI-powered nutrition recommendations

### 🍽️ Meal Logging
- CRUD operations for meals
- Meal type categorization (breakfast, lunch, dinner, snack)
- Nutritional information tracking
- Favorite meals for quick re-logging
- Date filtering and pagination

### 👤 Profile Management
- Personal information management
- Custom daily targets setting
- Activity level and goal configuration
- Auto-calculated calorie recommendations

### 🤖 AI Recommendations
- Rule-based nutrition insights
- Personalized meal suggestions
- Weekly habit analysis
- Goal-based recommendations

---

## 📁 Project Structure

```
nutrisaarthi/
├── client/                    # React Frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── layout/       # Layout components
│   │   ├── pages/            # Route pages
│   │   ├── stores/           # Zustand stores
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript definitions
│   │   ├── App.tsx           # Main app with routing
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── vite.config.ts
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── config/           # Database config
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helper functions
│   │   └── index.js          # Entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nutrisaarthi.git
   cd nutrisaarthi
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   # - MONGODB_URI: Your MongoDB connection string
   # - JWT_SECRET: A secure random string
   
   # Start the server
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

---

## 🔧 Environment Variables

### Backend (`server/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nutrisaarthi

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/targets` | Update daily targets |
| PUT | `/api/auth/password` | Change password |

### Meals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meals` | Get all meals (paginated) |
| POST | `/api/meals` | Create new meal |
| GET | `/api/meals/:id` | Get meal by ID |
| PUT | `/api/meals/:id` | Update meal |
| DELETE | `/api/meals/:id` | Delete meal |
| PATCH | `/api/meals/:id/favorite` | Toggle favorite |
| GET | `/api/meals/date/:date` | Get meals by date |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get all dashboard data |
| GET | `/api/dashboard/today` | Today's summary |
| GET | `/api/dashboard/trends` | Calorie trends |
| GET | `/api/dashboard/macros` | Macro breakdown |
| GET | `/api/dashboard/weekly-overview` | Weekly overview |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations` | Get daily recommendations |
| GET | `/api/recommendations/meals/:type` | Get meal suggestions |
| GET | `/api/recommendations/insights` | Get weekly insights |

---

## 🎨 Screenshots

### Dashboard
- Calorie progress ring with daily tracking
- Macro nutrient cards (protein, carbs, fat)
- Weekly calorie chart
- AI-powered recommendations panel

### Meal Log
- Paginated meal list with filters
- Add/Edit meal modal
- Date navigation
- Favorite meals toggle

### Profile
- Personal information form
- Daily target customization
- Goal selection

---

## 🧪 Development Scripts

### Backend
```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Production start
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📝 Git Commit History

This project follows **conventional commits**:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `perf:` Performance improvements
- `refactor:` Code refactoring

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI inspiration from modern nutrition apps

---

<p align="center">
  Made with ❤️ for better nutrition tracking
</p>
