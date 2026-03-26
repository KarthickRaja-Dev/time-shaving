import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, X, ArrowLeft, Save } from 'lucide-react';

const serviceSchema = z.object({
  name: z.string().min(2, 'Name required').max(100),
  description: z.string().min(1, 'Description required').max(1000),
  category: z.string().min(1, 'Category required'),
  price: z.coerce.number().positive('Must be positive'),
  duration: z.coerce.number().int().positive('Must be positive'),
  imageUrl: z.string().optional(),
});

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(serviceSchema) });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try { const r = await axiosInstance.get('/services/all'); setServices(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingId) { await axiosInstance.put(`/services/${editingId}`, data); }
      else { await axiosInstance.post('/services', data); }
      setShowForm(false); setEditingId(null); reset(); fetchServices();
    } catch (e) { alert(e.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleEdit = (s) => {
    setEditingId(s.id); reset({ name: s.name, description: s.description, category: s.category, price: s.price, duration: s.duration, imageUrl: s.imageUrl || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await axiosInstance.delete(`/services/${id}`); fetchServices(); }
    catch (e) { alert(e.response?.data?.message || 'Failed'); }
  };

  const handleNew = () => { setEditingId(null); reset({ name: '', description: '', category: '', price: '', duration: '', imageUrl: '' }); setShowForm(true); };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" /></div>;

  return (
    <div className="min-h-[80vh] py-10">
      <div className="page-container max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-sm text-gray-500 hover:text-rose-600 flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3" /> Dashboard</Link>
            <h1 className="section-title text-2xl">Manage Services</h1>
          </div>
          <button onClick={handleNew} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Service</button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold">{editingId ? 'Edit' : 'New'} Service</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input {...register('name')} className={`input-field ${errors.name ? 'input-error' : ''}`} />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea {...register('description')} rows={3} className={`input-field ${errors.description ? 'input-error' : ''}`} />{errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input {...register('category')} className={`input-field ${errors.category ? 'input-error' : ''}`} placeholder="e.g. Hair, Skin" />{errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}</div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label><input type="number" step="0.01" {...register('price')} className={`input-field ${errors.price ? 'input-error' : ''}`} />{errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label><input type="number" {...register('duration')} className={`input-field ${errors.duration ? 'input-error' : ''}`} />{errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>}</div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input {...register('imageUrl')} className="input-field" placeholder="Optional" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">{saving ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" /> : <><Save className="w-4 h-4" /> {editingId ? 'Update' : 'Create'}</>}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Service</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Duration</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.category}</td>
                    <td className="px-4 py-3 text-rose-600 font-semibold">₹{s.price}</td>
                    <td className="px-4 py-3 text-gray-600">{s.duration} min</td>
                    <td className="px-4 py-3"><span className={`badge ${s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(s)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600 mr-1"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
