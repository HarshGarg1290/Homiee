import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  getPersonalizedRecommendations,
  searchNeighborhood,
  getPlacesByCategory,
  getFilteredContent,
  getAllContent
} from '../controllers/neighborhoodController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/recommendations', getPersonalizedRecommendations);
router.get('/search', searchNeighborhood);
router.get('/places', getPlacesByCategory);
router.get('/filter', getFilteredContent);
router.get('/all', getAllContent);

export default router;
