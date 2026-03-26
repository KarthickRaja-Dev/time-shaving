import { Link } from 'react-router-dom';
import { Scissors, MapPin, Phone, Mail, Clock, Heart, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                TIME<span className="text-rose-400">SHAVING</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-2">
              FAST • STYLISH • AFFORDABLE
            </p>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Your neighbourhood grooming destination. Premium cuts and grooming services at honest prices.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-rose-600 flex items-center justify-center transition-colors">
                <Heart className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-rose-600 flex items-center justify-center transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-rose-600 flex items-center justify-center transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-rose-400 transition-colors">Home</Link></li>
              <li><Link to="/#services" className="hover:text-rose-400 transition-colors">Services</Link></li>
              <li><Link to="/#pricing" className="hover:text-rose-400 transition-colors">Pricing</Link></li>
              <li><Link to="/book" className="hover:text-rose-400 transition-colors">Book Appointment</Link></li>
              <li><Link to="/#contact" className="hover:text-rose-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-3 text-sm">
              <li>Hair Cuts & Styles</li>
              <li>Beard Trim & Shave</li>
              <li>Facials & DE-Tan</li>
              <li>Hair Colouring</li>
              <li>Kids Haircut</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                <span>123 Beauty Lane, Fashion District, Mumbai, 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>hello@glowstudio.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                <span>Every Day: 9:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="page-container py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} TIME SHAVING. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-rose-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-rose-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
