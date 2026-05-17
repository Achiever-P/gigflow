import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

// Create Lead
export const createLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = leadSchema.parse(req.body);
    const lead = await Lead.create({
      ...parsed,
      assignedTo: req.user?._id,
    });
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// Get all leads (with filtering, searching, pagination, sorting)
export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    // Filtering
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.source) {
      query.source = req.query.source;
    }

    // Searching
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    // Sorting
    const sortOrder = req.query.sort === 'Oldest' ? 1 : -1;

    const leads = await Lead.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email');

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single lead
export const getLeadById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// Update lead
export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = leadSchema.partial().parse(req.body); // Allow partial updates
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    Object.assign(lead, parsed);
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    next(error);
  }
};

// Delete lead
export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } catch (error) {
    next(error);
  }
};
