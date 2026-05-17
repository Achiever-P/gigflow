import mongoose, { Document, Schema } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: mongoose.Types.ObjectId; // Optional: to track which sales user it belongs to
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster searching/filtering
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ name: 'text', email: 'text' });
leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
