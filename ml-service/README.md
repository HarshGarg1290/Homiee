# ML Service for Flatmate Matching

This is a standalone Flask API service that hosts your trained Python ML model.

## Deployment Options

### 1. Railway (Recommended)

1. Create account at railway.app
2. Connect your GitHub repository
3. Select this `ml-service` folder as root
4. Railway will auto-detect Python and deploy

### 2. Render

1. Create account at render.com
2. Connect GitHub repo
3. Set root directory to `ml-service`
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `gunicorn app:app`

### 3. Heroku

1. Install Heroku CLI
2. Run: `heroku create your-ml-service-name`
3. Deploy: `git subtree push --prefix ml-service heroku main`

## Environment Variables

- `PORT`: Service port (auto-set by hosting platforms)

## API Endpoints

### Health Check

```
GET /health
```

### Single Prediction

```
POST /predict
{
  "user": { "age": 25, "location": "sydney", ... },
  "flatmate": { "age": 23, "location": "sydney", ... }
}
```

### Batch Predictions

```
POST /batch-predict
{
  "user": { "age": 25, "location": "sydney", ... },
  "flatmates": [
    { "id": "1", "age": 23, ... },
    { "id": "2", "age": 27, ... }
  ]
}
```
