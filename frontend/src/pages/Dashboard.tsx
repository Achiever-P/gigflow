import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lead, LeadsResponse } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { Search, Filter, Download, Plus, Trash2, Edit2, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { useAuth } from '../contexts/AuthContext';

const statusStyles: Record<string, string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Contacted: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", 
  Qualified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
};

export const Dashboard = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  
  // Stats state
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, qualified: 0 });

  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('Latest');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<LeadsResponse>('/leads', {
        params: {
          page,
          search: debouncedSearch,
          status: statusFilter,
          source: sourceFilter,
          sort: sortOrder,
        }
      });
      setLeads(data.leads);
      setTotalPages(data.pagination.pages);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const baseParams = { search: debouncedSearch, source: sourceFilter, limit: 1 };
      const [totalRes, newRes, contactedRes, qualifiedRes] = await Promise.all([
        api.get<LeadsResponse>('/leads', { params: baseParams }),
        api.get<LeadsResponse>('/leads', { params: { ...baseParams, status: 'New' } }),
        api.get<LeadsResponse>('/leads', { params: { ...baseParams, status: 'Contacted' } }),
        api.get<LeadsResponse>('/leads', { params: { ...baseParams, status: 'Qualified' } })
      ]);
      setStats({
        total: totalRes.data.pagination.total,
        new: newRes.data.pagination.total,
        contacted: contactedRes.data.pagination.total,
        qualified: qualifiedRes.data.pagination.total
      });
    } catch (e) {
      console.error('Failed to fetch stats', e);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [page, debouncedSearch, statusFilter, sourceFilter, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sourceFilter, sortOrder]);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        new Date(lead.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Management</h1>
        <div className="flex items-center gap-3">
          {user?.role === 'Admin' && (
            <>
              <button 
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button 
                onClick={() => { setLeadToEdit(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
              >
                <Plus size={18} />
                <span>New Lead</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Leads</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">New</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.new}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Contacted</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.contacted}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Qualified</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.qualified}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white min-w-[120px]"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white min-w-[120px]"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white min-w-[120px]"
            >
              <option value="Latest">Latest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-200">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-200">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-200">Source</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-200">Created</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4"><div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-500">{error}</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={48} className="text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-lg font-medium">No leads found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{lead.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.source}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { setLeadToEdit(lead); setIsModalOpen(true); }}
                          className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        {user?.role === 'Admin' && (
                          <button 
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this lead?')) {
                                try {
                                  await api.delete(`/leads/${lead._id}`);
                                  fetchLeads();
                                } catch (e) {
                                  alert('Failed to delete lead');
                                }
                              }
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && leads.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md text-sm disabled:opacity-50 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md text-sm disabled:opacity-50 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      <LeadFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLeads}
        leadToEdit={leadToEdit}
      />
    </div>
  );
};
