import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from '../controllers/leadController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createLead)
  .get(protect, getLeads);

router.route('/:id')
  .get(protect, getLeadById)
  .put(protect, updateLead)
  .delete(protect, adminOnly, deleteLead); // Only admin can delete

export default router;
