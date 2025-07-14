# Homiee - Flatmate Matching Platform

A comprehensive platform for finding flatmates, flat rentals, and replacement roommates in urban areas.

## 🏗️ Project Structure

This monorepo is organized into three main services:

```
Homiee/
├── frontend/           # Next.js React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   │   ├── common/ # Shared components (Layout, Card, Button, etc.)
│   │   │   └── flatmates/ # Feature-specific components
│   │   ├── pages/      # Next.js pages and API routes
│   │   ├── contexts/   # React contexts
│   │   ├── lib/        # Utilities and helpers
│   │   └── styles/     # Global styles
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
├── backend/            # Express.js API Server
│   ├── api/            # API endpoints
│   ├── controllers/    # Business logic
│   ├── routes/         # Route definitions
│   ├── middleware/     # Authentication & validation
│   ├── prisma/         # Database schema
│   └── package.json    # Backend dependencies
└── ml-service/         # Python ML Service
    ├── app.py          # Flask application
    ├── *.pkl           # Trained ML models (92.9% accuracy)
    ├── requirements.txt # Python dependencies
    └── README.md       # ML service docs
```

## Features

- **Intelligent Matching**: ML-powered compatibility scoring using enhanced Gradient Boosting model
- **Comprehensive Filtering**: City, locality, budget, and lifestyle preference filtering
- **Real-time Predictions**: Python-based ML model integration with Next.js API routes
- **Responsive UI**: Modern interface built with Tailwind CSS and reusable component system
- **Modular Architecture**: Clean separation of concerns with reusable components

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Reusable Component Library
- **Backend**: Express.js with Prisma ORM
- **ML Model**: scikit-learn Gradient Boosting Regressor (92.9% R² score)
- **Deployment**: Vercel frontend, Railway backend & ML service

## 🚀 Getting Started

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Access at: http://localhost:3000

### Backend (Express.js)
```bash
cd backend
npm install
npm start
```
Access at: http://localhost:8000

### ML Service (Python)
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```
Access at: http://localhost:5001

```
├── src/pages/              # Next.js pages and API routes
├── src/components/ui/      # Reusable UI components
├── api/                    # Python serverless functions
├── model/                  # Trained ML model files (.pkl)
├── public/                 # Static assets and dataset
├── ml_predict.py          # Python ML prediction script
└── requirements.txt       # Python dependencies
```

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## ML Model

The application uses a pre-trained Random Forest model that predicts flatmate compatibility based on:

- Location preferences (city, locality)
- Budget compatibility
- Lifestyle factors (eating habits, cleanliness, social preferences)
- Gender preferences

Model files:

- `model/flatmate_match_model.pkl` - Trained Random Forest model
- `model/flatmate_model_columns.pkl` - Feature columns for encoding

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

The Python ML model will automatically work as serverless functions on Vercel.

## API Endpoints

- `POST /api/flatmate-recommend` - Advanced ML-powered flatmate recommendations with 28-field compatibility analysis
- ML Service (Port 5001): Enhanced gradient boosting model with 94 features (90.2% accuracy)

## Environment Variables

Create a `.env.local` file with any required environment variables.

## License

MIT License
