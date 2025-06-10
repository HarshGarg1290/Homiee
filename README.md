# Homie - Flatmate Matching Platform

A Next.js application that uses machine learning to match compatible flatmates based on lifestyle preferences and requirements.

## Features

- **Intelligent Matching**: ML-powered compatibility scoring using trained Random Forest model
- **Comprehensive Filtering**: City, locality, budget, and lifestyle preference filtering
- **Real-time Predictions**: Python-based ML model integration with Next.js API routes
- **Responsive UI**: Modern interface built with Tailwind CSS and Radix UI components

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes, Python ML integration
- **ML Model**: scikit-learn Random Forest Regressor
- **Deployment**: Vercel with Python serverless functions

## Project Structure

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

- `POST /api/flatmate-recommend` - Get flatmate recommendations
- `POST /api/predict` - ML prediction endpoint (development: JavaScript, production: Python)

## Environment Variables

Create a `.env.local` file with any required environment variables.

## License

MIT License
