import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, MapPin, Tag, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Tech & Hardware',
  'Badges & Access',
  'Audio & Gadgets',
  'Personal & Apparel',
  'Documents & Wallets',
  'Other',
];

const BUILDINGS = ['HQ Building 1', 'Tower A', 'Tower B', 'Building 2 - Tech Park'];

const ReportItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Lost',
    category: 'Tech & Hardware',
    building: 'HQ Building 1',
    floor: '3rd Floor',
    roomZone: '',
    imageUrl: '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/items', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-emerald-900/10 shadow-sm">
        
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            Report Workplace Item
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Submit a misplaced item or something you found around the office campus.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Item Type Switch (Lost vs Found) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Item Status Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Lost' })}
                className={`py-2.5 rounded-lg text-xs font-bold border transition ${
                  formData.type === 'Lost'
                    ? 'bg-red-50 border-red-500 text-red-700 shadow-sm ring-1 ring-red-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🔴 I Lost an Item
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Found' })}
                className={`py-2.5 rounded-lg text-xs font-bold border transition ${
                  formData.type === 'Found'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🟢 I Found an Item
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Dell 65W USB-C Charger, Apple AirPods Pro Case"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white text-slate-700 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Workplace Location Coordinates */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              Workplace Location Coordinates
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Building</label>
                <select
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-700"
                >
                  {BUILDINGS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Floor</label>
                <input
                  type="text"
                  name="floor"
                  required
                  placeholder="e.g. 3rd Floor, Ground Floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Room or Specific Zone</label>
              <input
                type="text"
                name="roomZone"
                required
                placeholder="e.g. Conference Room 4A, Cafeteria booth, East Desk #42"
                value={formData.roomZone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description & Identifying Marks</label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Describe color, brand, condition, identifying stickers, or markings..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://example.com/item-photo.jpg (or leave blank)"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                required
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Contact Phone (Optional)</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-sm disabled:opacity-50 mt-4 ring-1 ring-emerald-600/30"
          >
            {loading ? 'Publishing Report...' : 'Publish Item to Workplace Directory'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ReportItem;
