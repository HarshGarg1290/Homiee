import express from 'express';
import { findFlatmateMatches } from '../controllers/flatmateController.js';
const router = express.Router();
// POST /api/flatmates/matches - Find compatible flatmates
router.post('/matches', findFlatmateMatches);
export default router;