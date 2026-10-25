import React, { useState } from 'react';
import API from '../services/api';
import { ShieldCheck, X, AlertCircle } from 'lucide-react';

const ClaimModal = ({ item, isOpen, onClose, onSuccess }) => {
  const [claimNote, setClaimNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post(`/items/${item._id}/claim`, { claimNote });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-emerald-900/20 overflow-hidden">
        
        {/* Header - Forest Green Theme */}
        <div className="bg-emerald-950 text-white p-4 flex justify-between items-center border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Submit Ownership Verification</h3>
          </div>
          <button onClick={onClose} className="text-emerald-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <p className="font-semibold text-slate-800">Claiming: {item.title}</p>
            <p className="text-slate-500 mt-0.5">Found at {item.building} • {item.floor}</p>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-md text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Proof of Ownership <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={claimNote}
              onChange={(e) => setClaimNote(e.target.value)}
              placeholder="Describe unique details that prove this belongs to you (e.g. lock screen wallpaper, sticker on back, serial number, pouch color)..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              The finder will verify these details before handing over the item.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Claim Request'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ClaimModal;
