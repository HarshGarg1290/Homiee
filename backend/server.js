import express from "express";
import dotenv from "dotenv";
import prisma from './lib/prisma.js';
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
// Import routes
import authRoutes from './routes/auth.js';
import flatmateRoutes from './routes/flatmates.js';
import savedFlatsRoutes from './routes/savedFlats.js';
import neighborhoodRoutes from './routes/neighborhood.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Trust proxy for Vercel deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://homiee-five.vercel.app'],
  credentials: true
}));
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit in development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
// Apply rate limiting to all requests
app.use(limiter);
// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 20, // Much higher limit in development
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});
// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Homiee Backend API is running!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/register', 
      'GET /api/flatmates',
      'POST /api/flatmates',
      'POST /api/saved-flats/save',
      'POST /api/saved-flats/unsave',
      'GET /api/saved-flats/:userId'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy' });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/flatmates', flatmateRoutes);
app.use('/api/saved-flats', savedFlatsRoutes);
app.use('/api/neighborhood', neighborhoodRoutes);


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
const testDBConnection = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.log("❌ Database connection error:", error);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

testDBConnection();

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
  });
}

// Export the app for Vercel
export default app;