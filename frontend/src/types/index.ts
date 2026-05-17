export type Role = 'Admin' | 'Sales User';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: Pagination;
}
