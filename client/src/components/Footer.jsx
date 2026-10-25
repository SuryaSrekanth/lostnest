import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Building2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
              <img
                src="/logo.png"
                alt="LostNest"
                className="w-8 h-8 object-contain drop-shadow"
              />
              <span className="tracking-tight text-white">
                Lost<span className="text-red-500 font-extrabold">Nest</span>
              </span>
            </Link>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Centralized corporate workplace registry for locating misplaced work equipment, access badges, and personal belongings across all campus facilities.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Internal Operations Desk
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-emerald-200/70 hover:text-white transition">
                  Browse Item Feed
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-emerald-200/70 hover:text-white transition">
                  Report a Lost or Found Item
                </Link>
              </li>
              <li>
                <Link to="/my-listings" className="text-emerald-200/70 hover:text-white transition">
                  My Reported Listings
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-emerald-200/70 hover:text-white transition">
                  Employee Portal Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Facilities Covered */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Campus Facilities
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-200/70">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                HQ Building 1 (Floors 1-6)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                Tower A & Tower B
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                Building 2 — Tech Park
              </li>
              <li className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                Central Security (Ext: 4402)
              </li>
            </ul>
          </div>

          {/* Verification Protocol Notice */}
          <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Ownership Protocol
            </div>
            <p className="text-[11px] text-emerald-200/70 leading-relaxed">
              Items marked as Found require specific verification details (stickers, serial numbers, screen locks) before handover by security or the finder.
            </p>
            <div className="pt-1">
              <span className="text-[10px] text-emerald-300 font-mono">
                Auto-purge: Resolved in 24h
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-emerald-300/60">
          <p>© {new Date().getFullYear()} LostNest Workplace Systems. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Internal Enterprise Portal</span>
            <span>•</span>
            <span>Workplace Operations & Asset Protection</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;