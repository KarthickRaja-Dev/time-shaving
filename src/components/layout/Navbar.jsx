import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, Scissors, User, LogOut, LayoutDashboard, CalendarDays } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/#services', label: 'Services', isAnchor: true },
    { to: '/#pricing', label: 'Pricing', isAnchor: true },
    { to: '/#contact', label: 'Contact', isAnchor: true },
  ];

  const handleAnchorClick = (hash) => {
    setMobileOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-gray-900">
              TIME<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">SHAVING</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isAnchor ? (
                <button
                  key={link.label}
                  onClick={() => handleAnchorClick(link.to.replace('/', ''))}
                  className="text-gray-600 hover:text-rose-600 font-medium transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link key={link.to} to={link.to} className="text-gray-600 hover:text-rose-600 font-medium transition-colors">
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn-ghost text-sm">
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link to="/my-bookings" className="btn-ghost text-sm">
                  <CalendarDays className="w-4 h-4" />
                  My Bookings
                </Link>
                <Link to="/book" className="btn-primary text-sm">
                  Book Now
                </Link>
                <div className="flex items-center gap-2 ml-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-rose-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Logout">
                    <LogOut className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <button
                    key={link.label}
                    onClick={() => handleAnchorClick(link.to.replace('/', ''))}
                    className="text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    {link.label}
                  </Link>
                )
              )}
              <hr className="my-2" />
              {isAuthenticated ? (
                <>
                  <Link to="/book" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-rose-600 font-semibold hover:bg-rose-50 rounded-lg">
                    Book Now
                  </Link>
                  <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    My Bookings
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-left px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="mx-4 mt-2 btn-primary text-sm justify-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
