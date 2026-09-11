import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Cloud, 
  Check, 
  Sparkles, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface UserAuthButtonProps {
  onOpenAuth: () => void;
  tripsCount: number;
}

export const UserAuthButton: React.FC<UserAuthButtonProps> = ({ onOpenAuth, tripsCount }) => {
  const { user, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-8 w-20 bg-slate-100 rounded-lg animate-pulse" />
    );
  }

  if (!user) {
    return (
      <button
        id="header-login-btn"
        type="button"
        onClick={onOpenAuth}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-50/50 hover:bg-amber-100/60 text-amber-800 text-xs sm:text-sm font-semibold transition cursor-pointer"
        title="Sign in to save and sync your vacations"
      >
        <LogIn className="w-3.5 h-3.5 text-amber-600" />
        <span>Log In</span>
      </button>
    );
  }

  const userInitial = (user.displayName || user.email || 'T')[0].toUpperCase();

  return (
    <div className="relative">
      <button
        id="user-profile-menu-button"
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium transition cursor-pointer"
        aria-expanded={dropdownOpen}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Traveler'}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold text-xs ring-1 ring-amber-400">
            {userInitial}
          </div>
        )}
        <span className="hidden md:inline-block max-w-[100px] truncate font-semibold text-slate-800">
          {user.displayName || user.email?.split('@')[0]}
        </span>
        <div className="hidden sm:flex items-center text-emerald-600" title="Cloud Sync Active">
          <Cloud className="w-3.5 h-3.5" />
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            {/* User Details */}
            <div className="px-3.5 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user.displayName || 'Traveler Account'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {user.email}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Cloud Sync Active</span>
              </div>
            </div>

            {/* Account Stats */}
            <div className="px-3.5 py-2 text-xs text-slate-600 border-b border-slate-100 flex items-center justify-between">
              <span>Saved Vacations</span>
              <span className="font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded-md">
                {tripsCount}
              </span>
            </div>

            <div className="px-3.5 py-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Private Firestore Database</span>
            </div>

            {/* Actions */}
            <div className="pt-1">
              <button
                type="button"
                onClick={async () => {
                  setDropdownOpen(false);
                  await logout();
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out / Switch Account</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
