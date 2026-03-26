import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Sparkles, Clock, Star, MapPin, Phone, Mail, ChevronRight, Scissors, Heart, ArrowRight, Flame, Zap } from 'lucide-react';

const testimonials = [
  { name: 'Rahul Verma', text: 'Best haircut I\'ve ever got! The fade was perfect and the price is unbeatable. Will come back every month.', rating: 5 },
  { name: 'Arjun Patel', text: 'Quick service, zero wait time. The beard trim was sharp and clean. Highly recommend!', rating: 5 },
  { name: 'Vikram Singh', text: 'Great premium facial at an affordable price. My skin felt amazing after. The staff is very friendly.', rating: 5 },
  { name: 'Karthik R', text: 'Took my kid for a haircut and they were so patient. Got myself a clean shave too — fantastic!', rating: 4 },
  { name: 'Anil Kumar', text: 'Hair colouring came out perfect. Professional work and the booking system made it so easy.', rating: 5 },
  { name: 'Deepak Sharma', text: 'DE-Tan treatment was worth every rupee. Fast service and great results. My go-to place now.', rating: 5 },
];

export default function HomePage() {
  const [services, setServices] = useState([]);
  useEffect(() => { axiosInstance.get('/services').then(r => setServices(r.data)).catch(() => {}); }, []);

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-rose-400/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="page-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-amber-400 font-semibold mb-6 shadow-sm">
              <Flame className="w-4 h-4" /> 10% OFF Monday – Friday!
            </div>
            <div className="text-5xl sm:text-6xl md:text-7xl mb-4">✂️</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              TIME{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">SHAVING</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 tracking-[0.3em] font-medium mb-8">
              FAST • STYLISH • AFFORDABLE
            </p>
            <p className="text-base md:text-lg text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
              Premium grooming services at honest prices. Walk in or book ahead — we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/book" className="btn-primary text-base px-8 py-4 shadow-lg hover:shadow-xl">
                Book Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#pricing" className="inline-flex items-center gap-2 px-8 py-4 text-white/80 border border-white/20 rounded-full font-medium hover:bg-white/10 transition-all">
                View Price List
              </a>
            </div>
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-white/50">
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> <span><strong className="text-white">4.9</strong> Rating</span></div>
              <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400" /> <span><strong className="text-white">1500+</strong> Happy Clients</span></div>
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> <span><strong className="text-white">Fast</strong> Service</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Professional grooming at unbeatable prices</p>
          </div>
          {categories.map(cat => (
            <div key={cat} className="mb-10">
              <h3 className="text-xl font-display font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" /> {cat}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.filter(s => s.category === cat).map(s => (
                  <div key={s.id} className="card group hover:-translate-y-1 transition-all duration-300">
                    <div className="h-2 gradient-rose" />
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 text-lg group-hover:text-rose-600 transition-colors">{s.name}</h4>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{s.description}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xl font-bold text-rose-600">₹{s.price}</span>
                        <span className="text-sm text-gray-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center mt-8">
            <Link to="/book" className="btn-primary">Book Now <ChevronRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">✂️ Price List</h2>
            <p className="section-subtitle">Transparent pricing — no hidden charges</p>
          </div>
          <div className="max-w-3xl mx-auto">
            {categories.map(cat => (
              <div key={cat} className="mb-8">
                <h3 className="font-display font-semibold text-lg text-rose-600 mb-3">{cat}</h3>
                <div className="card divide-y divide-gray-100">
                  {services.filter(s => s.category === cat).map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 hover:bg-rose-50/50 transition-colors">
                      <div>
                        <span className="font-medium text-gray-900">{s.name}</span>
                        <span className="text-sm text-gray-400 ml-2">({s.duration} min)</span>
                      </div>
                      <span className="font-bold text-rose-600 text-lg">₹{s.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* Special Offer Banner */}
            <div className="card p-6 gradient-rose text-white text-center mt-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-6 h-6" />
                <h3 className="font-display text-2xl font-bold">Special Offer</h3>
              </div>
              <p className="text-white/90 text-lg font-semibold">10% OFF Mon – Fri on all services!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">Real experiences from real people</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center text-white font-semibold text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Visit Us</h2>
            <p className="section-subtitle">Walk in or book ahead — we're ready for you</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-rose-600" /></div>
                  <div><h4 className="font-semibold text-gray-900">Address</h4><p className="text-sm text-gray-500 mt-1">123 Main Road,<br /> Your City, 600001</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-rose-600" /></div>
                  <div><h4 className="font-semibold text-gray-900">Phone</h4><p className="text-sm text-gray-500 mt-1">+91 98765 43210</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-rose-600" /></div>
                  <div><h4 className="font-semibold text-gray-900">Email</h4><p className="text-sm text-gray-500 mt-1">hello@timeshaving.com</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-rose-600" /></div>
                  <div><h4 className="font-semibold text-gray-900">Working Hours</h4><p className="text-sm text-gray-500 mt-1">Every Day: 9:00 AM – 9:00 PM</p></div>
                </div>
              </div>
            </div>
            <div className="card overflow-hidden">
              <iframe title="Time Shaving Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.0!2d72.85!3d18.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU3JzAwLjAiTiA3MsKwNTEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ minHeight: '300px', border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="page-container text-center">
          <div className="text-4xl mb-4">✂️</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Ready for a Fresh Look?</h2>
          <p className="text-white/50 tracking-[0.2em] text-sm font-medium mb-8">FAST • STYLISH • AFFORDABLE</p>
          <Link to="/book" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-rose-500/25 transition-all text-base">
            Book Your Slot <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
