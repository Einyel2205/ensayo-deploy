import express from 'express';
const router = express.Router();
import { generateResponse } from './chat';


router.post ( "/", generateResponse);

export default router;