import React, { useState } from 'react';
import { 
  Compass, 
  Plus, 
  Calendar, 
  MapPin, 
  Share2, 
  Edit3, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  Plane,
  Globe
} from 'lucide-react';
import { Trip } from '../types';
import { calculateDaysUntil, formatTripDates } from '../utils/storage';

interface HeaderProps {
  trips: Trip[];
  activeTrip: Trip;
  onSelectTrip: (tripId: string) => void;
  onNewTrip: () => void;
  onEditTrip: () => void;
  onOpenExport: () => void;
  onResetDemo: () => void;
  onOpenTripsManager?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  trips,
  activeTrip,
  onSelectTrip,
  onNewTrip,
  onEditTrip,
  onOpenExport,
  onResetDemo,
  onOpenTripsManager
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const daysInfo = calculateDaysUntil(activeTrip.startDate);
  const formattedDates = formatTripDates(activeTrip.startDate, activeTrip.endDate);
  const currentTripIndex = trips.findIndex((t) => t.id === activeTrip.id);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand & Trip Switcher */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-semibold">
              <Compass className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-slate-900 text-lg">Vacation Planner</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium hidden sm:inline-block">
                  Trip Organizer
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Trip Switcher */}
          <div className="flex items-center gap-2">
            {/* Trip Dropdown */}
            <div className="relative">
              <button
                id="trip-selector-button"
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium transition cursor-pointer"
                aria-expanded={dropdownOpen}
              >
                <Plane className="w-3.5 h-3.5 text-amber-600" />
                <span className="max-w-[140px] sm:max-w-[220px] truncate font-semibold">
                  {activeTrip.title}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Your Vacations ({trips.length})
                    </div>
                    {trips.map((trip) => (
                      <button
                        key={trip.id}
                        id={`switch-to-trip-${trip.id}`}
                        type="button"
                        onClick={() => {
                          onSelectTrip(trip.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm flex items-start gap-2.5 hover:bg-amber-50/60 transition cursor-pointer ${
                          trip.id === activeTrip.id ? 'bg-amber-50 text-amber-900 font-medium' : 'text-slate-700'
                        }`}
                      >
                        <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${trip.id === activeTrip.id ? 'text-amber-600' : 'text-slate-400'}`} />
                        <div className="min-w-0">
                          <p className="font-medium truncate text-slate-900">{trip.title}</p>
                          <p className="text-xs text-slate-500 truncate">{trip.destination}</p>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 my-1 pt-1">
                      {onOpenTripsManager && (
                        <button
                          id="dropdown-manage-all-trips-btn"
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            onOpenTripsManager();
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-amber-600" />
                            Manage All Vacations
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                            {trips.length}
                          </span>
                        </button>
                      )}
                      <button
                        id="dropdown-new-trip-btn"
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          onNewTrip();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Plan New Vacation
                      </button>
                      <button
                        id="dropdown-reset-demo-btn"
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          if (window.confirm('Reset to sample vacation trips? Custom changes will be restored to initial sample trips.')) {
                            onResetDemo();
                          }
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reload Sample Trips
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick action buttons */}
            <button
              id="export-print-btn"
              type="button"
              onClick={onOpenExport}
              title="Export or Share Trip Summary"
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              id="header-new-trip-button"
              type="button"
              onClick={onNewTrip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Vacation</span>
            </button>
          </div>
        </div>

        {/* Hero Banner with Destination and Countdown */}
        <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {trips.length > 1 && (
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                  Vacation {currentTripIndex >= 0 ? currentTripIndex + 1 : 1} of {trips.length}
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                daysInfo.status === 'ongoing' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : daysInfo.status === 'upcoming' 
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                <Sparkles className="w-3 h-3" />
                {daysInfo.label}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDates}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
                {activeTrip.title}
              </h1>
              <button
                id="edit-trip-details-button"
                type="button"
                onClick={onEditTrip}
                title="Edit vacation details, dates, or budget"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 text-sm flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{activeTrip.destination}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
