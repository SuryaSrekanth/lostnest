import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { Package, CheckCircle, Trash2, ShieldAlert, Loader2 } from 'lucide-react';

const MyListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wrapped in useCallback so React knows it doesn't change on every render
  const fetchMyItems = useCallback(async () => {
    try {
      const res = await API.get('/items/user/my-items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyItems();
  }, [fetchMyItems]);

  const handleResolve = async (id) => {
    try {
      await API.put(`/items/${id}/resolve`);
      fetchMyItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as returned');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/items/${id}`);
      fetchMyItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Reported Items</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your lost/found listings, review claim verifications, and mark resolved items.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-emerald-900/10 rounded-xl p-12 text-center shadow-sm">
          <Package className="w-12 h-12 text-emerald-900/20 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">You haven't reported any items yet</h3>
          <p className="text-xs text-slate-500 mt-1">Click "Report Item" in the navigation bar to add one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-xl border border-emerald-900/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      item.type === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.type}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{item.building} ({item.floor})</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                
                {/* Pending Claim or Found Notification Banner */}
                {item.status === 'Claim Pending' && item.claimDetails && (
                  <div className={`mt-2 p-3 rounded-lg text-xs space-y-1.5 border ${
                    item.type === 'Lost'
                      ? 'bg-emerald-50/90 border-emerald-300'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      {item.type === 'Lost' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-emerald-900">🎉 Colleague Reported Finding Your Lost Item:</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="text-amber-800">Pending Claim Verification Submitted:</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-800 italic bg-white p-2.5 rounded border border-slate-200/80">
                      "{item.claimDetails.claimNote}"
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 pt-0.5">
                      <span>
                        {item.type === 'Lost' ? 'Found by' : 'Claimant'}: <strong className="text-slate-900">{item.claimDetails.claimedBy?.name || 'Colleague'}</strong>
                        {item.claimDetails.claimedBy?.department && ` (${item.claimDetails.claimedBy.department})`}
                      </span>
                      {item.claimDetails.claimedBy?.email && (
                        <span className="text-emerald-800">✉️ {item.claimDetails.claimedBy.email}</span>
                      )}
                      {item.claimDetails.contactPhone && (
                        <span className="text-slate-800 font-semibold">📞 {item.claimDetails.contactPhone}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {item.status !== 'Returned' ? (
                  <button
                    onClick={() => handleResolve(item._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Returned
                  </button>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-900 rounded-lg text-xs font-semibold">
                      Resolved & Returned
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Auto-purging in 24h
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
