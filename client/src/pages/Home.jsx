import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';
import ClaimModal from '../components/ClaimModal';
import { PackageSearch, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Claim Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Search & Filter State
  const [filters, setFilters] = useState({
    type: 'All',
    category: 'All',
    building: 'All',
    search: '',
    hideReturned: true,
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type !== 'All') params.type = filters.type;
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.building !== 'All') params.building = filters.building;
      if (filters.search) params.search = filters.search;
      if (filters.hideReturned) params.status = 'Active';

      const res = await API.get('/items', { params });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load items from the corporate network.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleClaimClick = (item) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleResolve = async (id) => {
    try {
      await API.put(`/items/${id}/resolve`);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve item');
    }
  };

  // Stats calculation
  const lostCount = items.filter((i) => i.type === 'Lost').length;
  const foundCount = items.filter((i) => i.type === 'Found').length;

  return (
    <div>
      {/* Hero Stats Header - Forest Green Theme with Video & Ambient Glow */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-6 sm:p-8 mb-6 shadow-sm border border-emerald-900/60">
        
        {/* Background Loop Video Layer */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen pointer-events-none"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none transform-gpu"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none transform-gpu"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-[11px] font-mono text-emerald-300 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Corporate Directory Active
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Workplace Lost & Found Desk</h1>
            <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 max-w-xl">
              Centralized repository for misplaced work equipment, access cards, and personal gear across all corporate facilities.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-red-500/15 border border-red-500/40 px-4 py-2.5 rounded-xl text-center min-w-[100px]">
              <span className="block text-2xl font-black text-red-400">{lostCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-red-200 font-bold">Active Lost</span>
            </div>
            <div className="bg-emerald-500/15 border border-emerald-500/40 px-4 py-2.5 rounded-xl text-center min-w-[100px]">
              <span className="block text-2xl font-black text-emerald-400">{foundCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold">Reported Found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* Items Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-600" />
          <span className="text-xs font-medium">Scanning workplace directory...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <PackageSearch className="w-12 h-12 text-emerald-900/20 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No items match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search terms or clearing your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onClaimClick={handleClaimClick}
              onResolveClick={handleResolve}
            />
          ))}
        </div>
      )}

      {/* Claim Proof Modal */}
      <ClaimModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchItems}
      />
    </div>
  );
};

export default Home;
