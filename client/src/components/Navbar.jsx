import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-950 text-white shadow-md sticky top-0 z-50 border-b border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <img
              src="/logo.png"
              alt="LostNest"
              className="w-8 h-8 object-contain drop-shadow"
            />
            <span className="tracking-tight">
              Lost<span className="text-red-500 font-extrabold">Nest</span>
            </span>
            <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded font-mono border border-emerald-700/60 hidden sm:inline tracking-wider">
              FIND WHAT BELONGS
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-emerald-100/80 hover:text-white px-3 py-2 text-sm font-medium transition"
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
                  className="text-emerald-100/80 hover:text-white px-3 py-2 text-sm font-medium transition"
                >
                  My Listings
                </Link>

                {/* User Info & Logout */}
                <div className="flex items-center gap-3 pl-3 border-l border-emerald-800/80">
                  <div className="text-right hidden sm:block">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
