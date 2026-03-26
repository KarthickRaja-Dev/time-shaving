import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { ArrowLeft, CalendarDays, Clock, CheckCircle, Search } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchBookings(); }, [dateFilter]);

  const fetchBookings = async () => {
    try {
      const params = dateFilter ? `?date=${dateFilter}` : '';
      const r = await axiosInstance.get(`/bookings${params}`);
      setBookings(r.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleComplete = async (id) => {
    setActionLoading(id);
    try { await axiosInstance.put(`/bookings/${id}/complete`); fetchBookings(); }
    catch (e) { alert(e.response?.data?.message || 'Failed'); }
    finally { setActionLoading(null); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(id);
    try { await axiosInstance.put(`/bookings/${id}/cancel`); fetchBookings(); }
    catch (e) { alert(e.response?.data?.message || 'Failed'); }
    finally { setActionLoading(null); }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);
  const statusColors = { CONFIRMED: 'badge-confirmed', CANCELLED: 'badge-cancelled', COMPLETED: 'badge-completed' };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" /></div>;

  return (
    <div className="min-h-[80vh] py-10">
      <div className="page-container">
        <Link to="/admin" className="text-sm text-gray-500 hover:text-rose-600 flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3" /> Dashboard</Link>
        <h1 className="section-title text-2xl mb-2">All Bookings</h1>
        <p className="text-gray-500 mb-6">Manage all customer bookings</p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-2">
            {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${filter === f ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="input-field max-w-[180px] text-sm py-1.5 px-3" />
          {dateFilter && <button onClick={() => setDateFilter('')} className="text-xs text-rose-600 hover:underline">Clear date</button>}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No bookings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600">Customer</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Service</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Time</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Price</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{b.userName || '—'}</div>
                        <div className="text-xs text-gray-400">{b.userEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{b.serviceNames?.join(', ')}</td>
                      <td className="px-4 py-3 text-gray-600 flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {b.date}</td>
                      <td className="px-4 py-3 text-gray-600"><Clock className="w-3.5 h-3.5 inline mr-1" />{b.timeSlot} – {b.endTime}</td>
                      <td className="px-4 py-3 text-rose-600 font-semibold">₹{b.totalPrice}</td>
                      <td className="px-4 py-3"><span className={statusColors[b.status]}>{b.status}</span></td>
                      <td className="px-4 py-3 text-right space-x-1">
                        {b.status === 'CONFIRMED' && (
                          <>
                            <button onClick={() => handleComplete(b.id)} disabled={actionLoading === b.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50">
                              <CheckCircle className="w-3.5 h-3.5" /> Complete
                            </button>
                            <button onClick={() => handleCancel(b.id)} disabled={actionLoading === b.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
