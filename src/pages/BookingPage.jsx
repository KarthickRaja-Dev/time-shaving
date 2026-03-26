import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { CalendarDays, Clock, Sparkles, ChevronRight, Check, ArrowLeft, ShoppingCart, X, Minus, Plus } from 'lucide-react';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/services').then(r => setServices(r.data)).catch(() => {});
  }, []);

  const toggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) return prev.filter(s => s.id !== service.id);
      return [...prev, service];
    });
    setError('');
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const fetchSlots = async (serviceIds, date) => {
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const params = new URLSearchParams();
      serviceIds.forEach(id => params.append('serviceIds', id));
      params.append('date', date);
      const res = await axiosInstance.get(`/slots?${params.toString()}`);
      setSlots(res.data.availableSlots || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setError('');
    if (selectedServices.length > 0) {
      fetchSlots(selectedServices.map(s => s.id), date);
    }
  };

  const handleBook = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/bookings', {
        serviceIds: selectedServices.map(s => s.id),
        date: selectedDate,
        timeSlot: selectedSlot.startTime,
      });
      setBookingResult(res.data);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="min-h-[80vh] py-10">
      <div className="page-container max-w-4xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {['Services', 'Date & Time', 'Confirm', 'Done'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'gradient-rose text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`hidden sm:block text-sm font-medium ${step === i + 1 ? 'text-rose-600' : 'text-gray-400'}`}>{label}</span>
              {i < 3 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

        {/* Step 1: Select Services (Multi-select) */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="section-title text-center">Choose Services</h2>
            <p className="section-subtitle text-center">Select one or more services you'd like to book</p>
            {categories.map(cat => (
              <div key={cat} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" /> {cat}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.filter(s => s.category === cat).map(s => {
                    const isSelected = selectedServices.some(sel => sel.id === s.id);
                    return (
                      <button key={s.id} onClick={() => toggleService(s)}
                        className={`card p-5 text-left transition-all relative ${isSelected ? 'ring-2 ring-rose-500 bg-rose-50/50 border-rose-200' : 'hover:border-rose-300 hover:shadow-md'}`}>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <h4 className="font-semibold text-gray-900">{s.name}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-rose-600 font-bold">₹{s.price}</span>
                          <span className="text-sm text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration} min</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Floating Cart Summary */}
            {selectedServices.length > 0 && (
              <div className="sticky bottom-4 mt-6">
                <div className="card p-4 bg-gray-900 text-white border-0 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-white/60">{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} • {totalDuration} min</p>
                        <p className="text-lg font-bold">₹{totalPrice}</p>
                      </div>
                    </div>
                    <button onClick={() => setStep(2)} className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedServices.map(s => (
                      <span key={s.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-sm">
                        {s.name}
                        <button onClick={(e) => { e.stopPropagation(); toggleService(s); }} className="ml-1 hover:text-rose-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Date & Slot */}
        {step === 2 && (
          <div className="animate-fade-in">
            <button onClick={() => setStep(1)} className="btn-ghost mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
            <h2 className="section-title text-center">Pick Date & Time</h2>
            <p className="section-subtitle text-center">
              for <span className="text-rose-600 font-semibold">{selectedServices.map(s => s.name).join(', ')}</span>
              <span className="text-gray-400 ml-2">({totalDuration} min total)</span>
            </p>

            <div className="card p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDays className="w-4 h-4 inline mr-1" /> Select a Date
              </label>
              <input type="date" min={getMinDate()} value={selectedDate} onChange={e => handleDateChange(e.target.value)}
                className="input-field max-w-xs" />
            </div>

            {selectedDate && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" /> Available Slots
                </h3>
                {slotsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500" />
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No slots available for this date. Try another day.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {slots.map(slot => (
                      <button key={slot.startTime}
                        onClick={() => { setSelectedSlot(slot); setError(''); }}
                        className={`py-3 px-2 rounded-xl text-sm font-medium transition-all border
                          ${selectedSlot?.startTime === slot.startTime
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'}`}>
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                )}
                {selectedSlot && (
                  <div className="mt-6 text-center">
                    <button onClick={() => setStep(3)} className="btn-primary">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="animate-fade-in max-w-lg mx-auto">
            <button onClick={() => setStep(2)} className="btn-ghost mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
            <h2 className="section-title text-center">Confirm Booking</h2>
            <div className="card p-8 mt-6">
              <div className="space-y-4">
                <div>
                  <span className="text-gray-500 text-sm">Services</span>
                  <div className="mt-1 space-y-2">
                    {selectedServices.map(s => (
                      <div key={s.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900 text-sm">{s.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{s.duration} min</span>
                          <span className="font-semibold text-rose-600">₹{s.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selectedDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selectedSlot?.startTime} – {selectedSlot?.endTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total Duration</span><span className="font-medium">{totalDuration} min</span></div>
                <hr />
                <div className="flex justify-between text-lg"><span className="text-gray-700 font-semibold">Total</span><span className="font-bold text-rose-600">₹{totalPrice}</span></div>
              </div>
              <button onClick={handleBook} disabled={loading} className="btn-primary w-full justify-center mt-8 text-base disabled:opacity-60">
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" /> : <><Check className="w-5 h-5" /> Confirm Booking</>}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && bookingResult && (
          <div className="animate-fade-in max-w-lg mx-auto text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">Your appointment has been successfully booked.</p>

            {/* OTP Verification Code */}
            {bookingResult.otp && (
              <div className="card p-6 mb-6 bg-gradient-to-r from-gray-900 to-gray-800 border-0">
                <p className="text-white/60 text-sm font-medium mb-2">Your Verification Code</p>
                <p className="text-4xl font-mono font-bold text-white tracking-[0.5em] mb-2">
                  {bookingResult.otp}
                </p>
                <p className="text-amber-400 text-xs font-medium">Show this code at the counter for verification</p>
              </div>
            )}

            <div className="card p-6 text-left">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Services</span>
                  <p className="font-medium">{bookingResult.serviceNames?.join(', ')}</p>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{bookingResult.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{bookingResult.timeSlot} – {bookingResult.endTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-rose-600">₹{bookingResult.totalPrice}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="badge-confirmed">{bookingResult.status}</span></div>
              </div>
            </div>
            <div className="flex gap-4 justify-center mt-8">
              <button onClick={() => navigate('/my-bookings')} className="btn-primary">View My Bookings</button>
              <button onClick={() => navigate('/')} className="btn-secondary">Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
