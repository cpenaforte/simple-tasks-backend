import express from 'express';
const router = express.Router();

import {
  getPlans, getPlanByTitle, getUserPlanByUserId, createUserPlan, updateUserPlan, deactivateUserPlanByUserId,
} from '../controllers/planController';

router.get('/', getPlans);
router.get('/:title', getPlanByTitle);
router.get('/userplans/:id', getUserPlanByUserId);
router.post('/userplans', createUserPlan);
router.put('/userplans', updateUserPlan);
router.delete('/userplans/:id', deactivateUserPlanByUserId);

export default router;