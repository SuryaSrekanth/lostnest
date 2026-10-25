import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  X,
  AlertCircle,
  MapPin,
  Calendar,
  Handshake,
  LogIn,
  Tag,
  Phone,
  MessageSquare
} from 'lucide-react';

const ClaimModal = ({ item, isOpen, onClose, onSuccess, onResolve }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [claimNote, setClaimNote] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Reset state on new item selection
    setClaimNote('');
    setContactPhone('');
    setError('');
    setSuccessMsg('');
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const isLost = item.type === 'Lost';
  const isFound = item.type === 'Found';
  const isReturned = item.status === 'Returned';
  const isClaimPending = item.status === 'Claim Pending';
  const isOwner = user && user.id === (item.reportedBy?._id || item.reportedBy);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await API.post(`/items/${item._id}/claim`, {
        claimNote,
        contactPhone,
      });

      setSuccessMsg(res.data.message || (isLost ? 'Found notification posted!' : 'Claim request sent!'));
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDirectly = async () => {
    if (!onResolve) return;
    try {
      await onResolve(item._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to mark as returned');
    }
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-emerald-900/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header with Type Badge */}
        <div className="bg-emerald-950 text-white p-4 sm:p-5 flex justify-between items-start border-b border-emerald-900">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  isLost ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {item.type} Item
              </span>
              <span className="text-[11px] text-emerald-300 font-mono">
                {item.category}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
              {item.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-900/60 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Optional Item Image or Category Placeholder */}
          {item.imageUrl && (
            <div className="h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Item Description & Workplace Coordinates */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
            <p className="text-slate-700 leading-relaxed font-normal">
              {item.description}
            </p>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-y-1 gap-x-3 text-slate-500 font-medium">
              <div className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{item.building} • {item.floor} ({item.roomZone})</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>{new Date(item.dateReported).toLocaleDateString()}</span>
              </div>
            </div>

            {item.reportedBy?.name && (
              <p className="text-[11px] text-slate-400 pt-1">
                Reported by <span className="font-semibold text-slate-600">{item.reportedBy.name}</span>
                {item.reportedBy.department && ` (${item.reportedBy.department})`}
              </p>
            )}
          </div>

          {/* Alert / Error / Success Messages */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* CASE 1: Item is already Resolved & Returned */}
          {isReturned ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-900 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>This item has been returned & resolved.</span>
              </div>
              <p className="text-[11px] text-emerald-700/80">
                Auto-purging from the corporate registry in 24 hours.
              </p>
            </div>
          ) : isClaimPending ? (
            /* CASE 2: A Found Report or Claim has already been submitted */
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                {isLost ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Colleague Reported Finding This Lost Item!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Ownership Claim In Review</span>
                  </>
                )}
              </div>

              {item.claimDetails?.claimNote && (
                <div className="bg-white p-3 rounded-lg border border-amber-200/80 text-xs text-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {isLost ? 'Finder Pickup Instructions / Location' : 'Proof of Ownership'}
                  </span>
                  <p className="italic text-slate-700">"{item.claimDetails.claimNote}"</p>
                </div>
              )}

              {item.claimDetails?.claimedBy?.name && (
                <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-2">
                  <span>Contact: <strong>{item.claimDetails.claimedBy.name}</strong></span>
                  {item.claimDetails.claimedBy.department && <span>({item.claimDetails.claimedBy.department})</span>}
                  {item.claimDetails.contactPhone && <span>• 📞 {item.claimDetails.contactPhone}</span>}
                </div>
              )}

              {/* If owner is viewing, let them close it */}
              {isOwner && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResolveDirectly}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isLost ? 'I Received My Item — Mark as Returned' : 'Confirm Return & Close Listing'}
                  </button>
                </div>
              )}
            </div>
          ) : isOwner ? (
            /* CASE 3: Current user is the owner, item is active */
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-600">
                You reported this listing. When a colleague reports finding this item or submits an ownership claim, it will appear directly on this card.
              </p>
              <button
                type="button"
                onClick={handleResolveDirectly}
                className="w-full py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                {isLost ? 'I Got It Back — Close Report' : 'Mark as Returned & Close'}
              </button>
            </div>
          ) : !user ? (
            /* CASE 4: Not logged in */
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-600">
                {isLost
                  ? 'Sign in to notify the person who lost this item where they can pick it up.'
                  : 'Sign in to submit your ownership claim verification.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Workplace Account
              </button>
            </div>
          ) : isLost ? (
            /* CASE 5: Lost Item - Post Found Request Form (No external mail app!) */
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Handshake className="w-4 h-4 text-emerald-700" />
                  <span>Found this item? Post a pickup note to the owner</span>
                </div>
                <p className="text-[11px] text-emerald-700/90 mt-0.5">
                  Your note will be posted directly to this card for the person who lost it. No external email needed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Where did you find it / Where can the owner collect it?</span>
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={claimNote}
                  onChange={(e) => setClaimNote(e.target.value)}
                  placeholder="e.g. Found on cafeteria table #4. I handed it over to Building 1 Security Desk / Kept it at my desk (Floor 3, Desk 12)..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Your Contact Phone or Desk Extension (Optional)</span>
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. Ext 4120 or +91 98765 43210"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Handshake className="w-4 h-4" />
                  {loading ? 'Posting...' : 'Post Found Notification'}
                </button>
              </div>
            </form>
          ) : (
            /* CASE 6: Found Item - Submit Claim Form */
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Submit Ownership Verification</span>
                </div>
                <p className="text-[11px] text-emerald-700/90 mt-0.5">
                  Provide unique identifying details so the finder can verify you are the legitimate owner.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proof of Ownership <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={claimNote}
                  onChange={(e) => setClaimNote(e.target.value)}
                  placeholder="Describe unique details only you know (e.g. lock screen photo, stickers on back, serial number, scratch marks, pouch color)..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Send Claim Verification'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default ClaimModal;