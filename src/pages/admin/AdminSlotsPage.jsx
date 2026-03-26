import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Clock } from 'lucide-react';

const slotSchema = z.object({
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:mm format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:mm format'),
  bufferMinutes: z.coerce.number().int().min(0, 'Cannot be negative'),
});

const DAYS = [
  { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }, { value: 6, label: 'Saturday' }, { value: 7, label: 'Sunday' },
];

export default function AdminSlotsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workingDays, setWorkingDays] = useState([1, 2, 3, 4, 5, 6]);
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(slotSchema) });

  useEffect(() => {
    axiosInstance.get('/admin/slot-config').then(r => {
      const d = r.data;
      reset({ startTime: d.startTime, endTime: d.endTime, bufferMinutes: d.bufferMinutes });
      setWorkingDays(d.workingDays || [1, 2, 3, 4, 5, 6]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [reset]);

  const toggleDay = (day) => {
    setWorkingDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort());
  };

  const onSubmit = async (data) => {
    if (workingDays.length === 0) { alert('Select at least one working day'); return; }
    setSaving(true);
    setSuccess('');
    try {
      await axiosInstance.put('/admin/slot-config', { ...data, workingDays });
      setSuccess('Configuration saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) { alert(e.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" /></div>;

  return (
    <div className="min-h-[80vh] py-10">
      <div className="page-container max-w-2xl">
        <Link to="/admin" className="text-sm text-gray-500 hover:text-rose-600 flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3" /> Dashboard</Link>
        <h1 className="section-title text-2xl mb-2">Slot Configuration</h1>
        <p className="text-gray-500 mb-8">Configure your parlour's working hours and booking slots</p>

        {success && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm mb-6">{success}</div>}

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"><Clock className="w-3.5 h-3.5 inline mr-1" /> Start Time</label>
                <input type="time" {...register('startTime')} className={`input-field ${errors.startTime ? 'input-error' : ''}`} />
                {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"><Clock className="w-3.5 h-3.5 inline mr-1" /> End Time</label>
                <input type="time" {...register('endTime')} className={`input-field ${errors.endTime ? 'input-error' : ''}`} />
                {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Between Slots (minutes)</label>
              <input type="number" {...register('bufferMinutes')} className={`input-field max-w-xs ${errors.bufferMinutes ? 'input-error' : ''}`} />
              {errors.bufferMinutes && <p className="text-xs text-red-500 mt-1">{errors.bufferMinutes.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DAYS.map(d => (
                  <button type="button" key={d.value} onClick={() => toggleDay(d.value)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all
                      ${workingDays.includes(d.value) ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
              {saving ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" /> : <><Save className="w-4 h-4" /> Save Configuration</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
