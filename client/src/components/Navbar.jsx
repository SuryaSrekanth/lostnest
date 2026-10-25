import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, LogOut, LogIn, Menu, X, Layers, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-emerald-950 text-white shadow-md sticky top-0 z-50 border-b border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-2">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            onClick={closeMenu}
            className="flex items-center gap-2 sm:gap-2.5 text-lg sm:text-xl font-bold tracking-tight shrink-0"
          >
            <img
              src="/logo.png"
              alt="LostNest"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow shrink-0"
            />
            <span className="tracking-tight whitespace-nowrap">
              Lost<span className="text-red-500 font-extrabold">Nest</span>
            </span>
            <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded font-mono border border-emerald-700/60 hidden lg:inline tracking-wider">
              FIND WHAT BELONGS
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition ${
                location.pathname === '/' ? 'text-white font-semibold' : 'text-emerald-100/80 hover:text-white'
              }`}
            >
              Browse Feed
            </Link>

            {user ? (
              <>
                <Link
                  to="/report"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition shadow-sm ring-1 ring-emerald-400/30"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Item
                </Link>

                <Link
                  to="/my-listings"
                  className={`px-3 py-2 text-sm font-medium transition ${
                    location.pathname === '/my-listings' ? 'text-white font-semibold' : 'text-emerald-100/80 hover:text-white'
                  }`}
                >
                  My Listings
                </Link>

                {/* User Info & Logout */}
                <div className="flex items-center gap-3 pl-3 border-l border-emerald-800/80">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-emerald-300/80 leading-tight">{user.department}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-emerald-200 hover:text-rose-400 hover:bg-emerald-900/80 rounded-md transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 px-3.5 py-1.5 rounded-md text-sm font-medium transition border border-emerald-800/60"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Compact Action + Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <Link
                to="/report"
                onClick={closeMenu}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-md text-xs font-medium transition shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center gap-1 bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 px-2.5 py-1.5 rounded-md text-xs font-medium transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-md transition focus:outline-none focus:ring-1 focus:ring-emerald-400"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950/98 backdrop-blur-md border-t border-emerald-900/80 px-4 pt-3 pb-5 space-y-2 shadow-2xl">
          {user && (
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-emerald-900/70 px-2">
              <div>
                <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                <p className="text-xs text-emerald-300/80 leading-tight">{user.department} • {user.email}</p>
              </div>
              <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50 font-mono">
                Employee
              </span>
            </div>
          )}

          <Link
            to="/"
            onClick={closeMenu}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              location.pathname === '/' 
                ? 'bg-emerald-900/80 text-white border border-emerald-700/60 font-semibold' 
                : 'text-emerald-100/90 hover:bg-emerald-900/40 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            Browse Feed
          </Link>

          {user ? (
            <>
              <Link
                to="/report"
                onClick={closeMenu}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  location.pathname === '/report' 
                    ? 'bg-emerald-900/80 text-white border border-emerald-700/60 font-semibold' 
                    : 'text-emerald-100/90 hover:bg-emerald-900/40 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Report Lost / Found Item
              </Link>

              <Link
                to="/my-listings"
                onClick={closeMenu}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  location.pathname === '/my-listings' 
                    ? 'bg-emerald-900/80 text-white border border-emerald-700/60 font-semibold' 
                    : 'text-emerald-100/90 hover:bg-emerald-900/40 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                My Reported Listings
              </Link>

              <div className="pt-2 border-t border-emerald-900/70">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out ({user.name})
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-emerald-900/70 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full bg-emerald-900/70 hover:bg-emerald-900 text-emerald-100 px-4 py-2.5 rounded-lg text-sm font-medium border border-emerald-800/80 transition"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Workplace Account
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow transition"
              >
                <UserPlus className="w-4 h-4" />
                Register New Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;