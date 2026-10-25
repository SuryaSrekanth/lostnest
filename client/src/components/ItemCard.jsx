import { MapPin, Calendar, Tag, ShieldCheck, CheckCircle, Handshake, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ItemCard = ({ item, onClaimClick, onResolveClick }) => {
  const { user } = useAuth();

  const isLost = item.type === 'Lost';
  const isFound = item.type === 'Found';
  const isReturned = item.status === 'Returned';
  const isClaimPending = item.status === 'Claim Pending';
  const isOwner = user && user.id === (item.reportedBy?._id || item.reportedBy);

  return (
    <div
      onClick={() => onClaimClick && onClaimClick(item)}
      className="bg-white rounded-xl shadow-sm border border-emerald-900/10 overflow-hidden hover:shadow-md hover:border-emerald-700/40 transition cursor-pointer flex flex-col group"
    >
      
      {/* Image / Category Placeholder */}
      <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <Tag className="w-10 h-10 mb-1 opacity-40 text-emerald-950" />
            <span className="text-xs font-mono">{item.category}</span>
          </div>
        )}

        {/* Type Badge (Lost vs Found) */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wide uppercase shadow-sm ${
              isLost
                ? 'bg-red-600 text-white ring-1 ring-red-400/40'
                : 'bg-emerald-700 text-white ring-1 ring-emerald-500/40'
            }`}
          >
            {item.type}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
              isReturned
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : isClaimPending
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-white/90 text-slate-800 border-slate-200 backdrop-blur-sm'
            }`}
          >
            {isClaimPending
              ? isLost
                ? 'Found Update Posted'
                : 'Claim Pending'
              : item.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            {item.category}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-1 group-hover:text-emerald-900 transition" title={item.title}>
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* If a found update is posted on a Lost item, show a callout snippet */}
          {isClaimPending && item.claimDetails?.claimNote && (
            <div className="mt-2.5 p-2 bg-emerald-50/90 border border-emerald-200 rounded-lg text-xs">
              <div className="flex items-center gap-1 font-bold text-emerald-900">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isLost ? 'Colleague Found This!' : 'Claim In Review'}</span>
              </div>
              <p className="text-[11px] text-emerald-800 italic line-clamp-1 mt-0.5">
                "{item.claimDetails.claimNote}"
              </p>
            </div>
          )}
        </div>

        {/* Workplace Location Coordinates */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-semibold text-slate-800">{item.building}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">{item.floor}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 italic truncate">{item.roomZone}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{new Date(item.dateReported).toLocaleDateString()}</span>
            </div>
            {item.reportedBy?.name && (
              <span className="font-medium text-slate-500">By {item.reportedBy.name}</span>
            )}
          </div>
        </div>

        {/* Action Button - Opens Modal Directly inside App */}
        <div className="mt-4 pt-2">
          {isReturned ? (
            <div className="flex flex-col items-center justify-center py-2 text-xs font-semibold text-emerald-900 bg-emerald-50/70 border border-emerald-100 rounded-lg">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>Returned & Resolved</span>
              </div>
              <span className="text-[10px] text-emerald-700/70 font-normal">Auto-purges from DB in 24h</span>
            </div>
          ) : isOwner ? (
            /* Direct Close button for the owner who reported it */
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResolveClick && onResolveClick(item._id);
              }}
              className="w-full py-2 bg-emerald-950 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ring-1 ring-emerald-800/60"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              {isLost ? 'I Got It Back — Close Report' : 'Mark as Returned & Close'}
            </button>
          ) : isClaimPending ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClaimClick(item);
              }}
              className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              {isLost ? 'Found Update Posted — View Info' : 'Claim Pending Review — View'}
            </button>
          ) : isFound ? (
            /* Claim button for colleagues on Found items */
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClaimClick(item);
              }}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Claim This Item
            </button>
          ) : (
            /* IN-APP Found Notification button for Lost items (NO external mail app!) */
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClaimClick(item);
              }}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm ring-1 ring-emerald-600/40"
            >
              <Handshake className="w-4 h-4 text-emerald-300" />
              I Found This Item — Notify Owner
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ItemCard;