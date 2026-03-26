import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { CalendarDays, Clock, X, AlertCircle } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await axiosInstance.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    } finally { setCancellingId(null); }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  const statusColors = { CONFIRMED: 'badge-confirmed', CANCELLED: 'badge-cancelled', COMPLETED: 'badge-completed' };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" />
    </div>
  );

  return (
    <div className="min-h-[80vh] py-10">
      <div className="page-container max-w-3xl">
        <h1 className="section-title">My Bookings</h1>
        <p className="text-gray-500 mb-8">View and manage your appointments</p>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${filter === f ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(b => (
              <div key={b.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{b.serviceNames?.join(', ')}</h3>
                    <span className={statusColors[b.status]}>{b.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {b.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {b.timeSlot} – {b.endTime}</span>
                    <span className="text-rose-600 font-medium">₹{b.totalPrice}</span>
                  </div>
                </div>
                {b.status === 'CONFIRMED' && (
                  <button onClick={() => handleCancel(b.id)} disabled={cancellingId === b.id}
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
                    {cancellingId === b.id ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500" /> : <><X className="w-4 h-4" /> Cancel</>}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
