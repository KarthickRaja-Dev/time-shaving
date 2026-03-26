import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { BarChart3, CalendarDays, Users, Scissors, DollarSign, TrendingUp, ArrowRight, Settings, BookOpen } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" />
    </div>
  );

  const cards = [
    { label: "Today's Bookings", value: stats?.todayBookings || 0, icon: CalendarDays, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: BookOpen, color: 'bg-rose-100 text-rose-600' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Total Services', value: stats?.totalServices || 0, icon: Scissors, color: 'bg-purple-100 text-purple-600' },
    { label: "Today's Revenue", value: `₹${stats?.todayRevenue || 0}`, icon: DollarSign, color: 'bg-amber-100 text-amber-600' },
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: TrendingUp, color: 'bg-teal-100 text-teal-600' },
  ];

  const quickLinks = [
    { to: '/admin/services', label: 'Manage Services', icon: Scissors, desc: 'Add, edit, or remove services' },
    { to: '/admin/slots', label: 'Slot Configuration', icon: Settings, desc: 'Configure working hours & buffer' },
    { to: '/admin/bookings', label: 'All Bookings', icon: CalendarDays, desc: 'View & manage all bookings' },
  ];

  return (
    <div className="min-h-[80vh] py-10">
      <div className="page-container">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="text-gray-500 mb-8">Overview of your parlour's performance</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {cards.map(c => (
            <div key={c.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
                <c.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Booking Status Breakdown */}
        {stats?.bookingsByStatus && (
          <div className="card p-6 mb-10">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-rose-400" /> Booking Status</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(stats.bookingsByStatus).map(([status, count]) => {
                const colors = { CONFIRMED: 'bg-emerald-500', COMPLETED: 'bg-blue-500', CANCELLED: 'bg-red-400' };
                return (
                  <div key={status} className="text-center">
                    <div className={`h-2 rounded-full ${colors[status]} mb-2`} style={{ width: `${Math.max(10, (count / Math.max(1, stats.totalBookings)) * 100)}%`, margin: '0 auto' }} />
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">{status}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map(l => (
            <Link key={l.to} to={l.to} className="card p-5 group hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center"><l.icon className="w-5 h-5 text-rose-600" /></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm group-hover:text-rose-600 transition-colors">{l.label}</h4>
                    <p className="text-xs text-gray-500">{l.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
