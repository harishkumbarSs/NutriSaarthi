# 🥗 NutriSaarthi

**Your Intelligent Nutrition Companion**

NutriSaarthi is a full-stack MERN application designed to help users track their nutrition, log meals, and receive AI-powered dietary recommendations based on their health goals.

---

## 🚀 Tech Stack

### Frontend (`/client`)
- **React.js** with TypeScript
- **Vite** for blazing-fast development
- **React Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Axios** for HTTP requests

### Backend (`/server`)
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing

---

## 📁 Project Structure

```
nutrisaarthi/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── stores/         # Zustand state stores
│   │   ├── services/       # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── ...
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nutrisaarthi.git
   cd nutrisaarthi
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 📜 Features

- ✅ User authentication (Register/Login)
- ✅ Meal logging with nutritional data
- ✅ Dashboard with calorie tracking
- ✅ Analytics and trends visualization
- ✅ AI-powered nutrition recommendations
- ✅ User profile and goal management

---

## 🔐 Environment Variables

See `.env.example` files in both `/client` and `/server` directories.

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

