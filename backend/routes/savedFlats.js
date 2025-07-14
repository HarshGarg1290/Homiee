import express from 'express';
import { saveFlat, unsaveFlat, getSavedFlats, checkFlatSaved } from '../controllers/savedFlatsController.js';

const router = express.Router();

// GET /api/saved-flats/check - Check if a flat is saved (put this BEFORE /:userId)
router.get('/check', checkFlatSaved);

// POST /api/saved-flats/save - Save a flat
router.post('/save', saveFlat);

// POST /api/saved-flats/unsave - Remove a saved flat
router.post('/unsave', unsaveFlat);

// GET /api/saved-flats/:userId - Get all saved flats for a user (put this AFTER /check)
router.get('/:userId', getSavedFlats);

export default router;
