import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Luggage, 
  Wallet, 
  Copy, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Search, 
  Check, 
  ArrowRight,
  Plane,
  Clock,
  Compass,
  FileDown
} from 'lucide-react';
import { Trip, ActiveTab } from '../types';
import { calculateDaysUntil, formatTripDates, formatCurrency } from '../utils/storage';
import { TRIP_PRESETS, createTripFromPreset } from '../data/tripPresets';

interface TripsManagerTabProps {
  trips: Trip[];
  activeTripId: string;
  onSelectTrip: (tripId: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onNewTrip: () => void;
  onEditTrip: (trip: Trip) => void;
  onDuplicateTrip: (tripId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onAddPresetTrip: (newTrip: Trip) => void;
}

export const TripsManagerTab: React.FC<TripsManagerTabProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onNavigateTab,
  onNewTrip,
  onEditTrip,
  onDuplicateTrip,
  onDeleteTrip,
  onAddPresetTrip
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const daysInfo = calculateDaysUntil(trip.startDate);
    if (filterStatus === 'all') return true;
    if (filterStatus === 'upcoming') return daysInfo.status === 'upcoming';
    if (filterStatus === 'ongoing') return daysInfo.status === 'ongoing';
    if (filterStatus === 'past') return daysInfo.status === 'past';

    return true;
  });

  const handleOpenTrip = (tripId: string, targetTab: ActiveTab = 'overview') => {
    onSelectTrip(tripId);
    onNavigateTab(targetTab);
  };

  const handleDuplicate = (trip: Trip) => {
    onDuplicateTrip(trip.id);
    setCopiedId(trip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = () => {
    if (tripToDelete) {
      onDeleteTrip(tripToDelete.id);
      setTripToDelete(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                Travel Hub
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {trips.length} {trips.length === 1 ? 'Vacation' : 'Vacations'} Planned
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              All Your Vacations
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Switch between trips, plan multiple adventures simultaneously, or start from a destination template.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="trips-manager-new-trip-btn"
              type="button"
              onClick={onNewTrip}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Plan Custom Vacation
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by vacation title or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {(['all', 'upcoming', 'ongoing', 'past'] as const).map((status) => {
              const count = status === 'all' 
                ? trips.length 
                : trips.filter((t) => calculateDaysUntil(t.startDate).status === status).length;
              
              const labels = {
                all: 'All',
                upcoming: 'Upcoming',
                ongoing: 'Ongoing',
                past: 'Past'
              };

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    filterStatus === status
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {labels[status]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No vacations found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery 
              ? `No vacations match "${searchQuery}". Try a different search term or clear filters.`
              : 'You have no vacations in this category.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium cursor-pointer"
              >
                Clear Search
              </button>
            )}
            <button
              type="button"
              onClick={onNewTrip}
              className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold cursor-pointer"
            >
              Plan New Vacation
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const isActive = trip.id === activeTripId;
            const daysInfo = calculateDaysUntil(trip.startDate);
            const formattedDates = formatTripDates(trip.startDate, trip.endDate);
            
            // Stats
            const totalActivities = trip.itinerary.reduce((acc, d) => acc + d.activities.length, 0);
            const totalTodos = trip.todos.length;
            const completedTodos = trip.todos.filter((t) => t.completed).length;
            const todoPercent = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
            
            const totalPacking = trip.packingList.length;
            const packedItems = trip.packingList.filter((p) => p.packed).length;
            const packingPercent = totalPacking > 0 ? Math.round((packedItems / totalPacking) * 100) : 0;

            const totalSpent = trip.expenses.reduce((acc, e) => acc + e.amount, 0);
            const budgetPercent = trip.budgetTotal > 0 ? Math.min(100, Math.round((totalSpent / trip.budgetTotal) * 100)) : 0;

            return (
              <div
                key={trip.id}
                id={`trip-card-${trip.id}`}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs flex flex-col overflow-hidden ${
                  isActive 
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Top Banner Gradient */}
                <div className={`p-4 bg-gradient-to-r ${trip.coverGradient || 'from-amber-500/20 via-orange-500/10 to-sky-500/20'} border-b border-slate-100 flex items-start justify-between gap-2`}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      daysInfo.status === 'ongoing'
                        ? 'bg-emerald-100 text-emerald-800'
                        : daysInfo.status === 'upcoming'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {daysInfo.label}
                    </span>

                    {isActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Active View
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Edit trip details"
                      onClick={() => onEditTrip(trip)}
                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-md transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Duplicate trip"
                      onClick={() => handleDuplicate(trip)}
                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-md transition cursor-pointer"
                    >
                      {copiedId === trip.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      title="Delete trip"
                      onClick={() => setTripToDelete(trip)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white/60 rounded-md transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display line-clamp-1">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{trip.destination}</span>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formattedDates}</span>
                    </p>
                  </div>

                  {/* Progress Metrics */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                    {/* Itinerary */}
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        Itinerary
                      </span>
                      <span className="font-semibold text-slate-800">
                        {trip.itinerary.length} Days • {totalActivities} Events
                      </span>
                    </div>

                    {/* To-Do Checklist */}
                    <div>
                      <div className="flex items-center justify-between text-slate-600 mb-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                          Pre-Trip Checklist
                        </span>
                        <span className="font-semibold text-slate-800">
                          {completedTodos}/{totalTodos} ({todoPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${todoPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Packing Progress */}
                    <div>
                      <div className="flex items-center justify-between text-slate-600 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Luggage className="w-3.5 h-3.5 text-indigo-500" />
                          Packing List
                        </span>
                        <span className="font-semibold text-slate-800">
                          {packedItems}/{totalPacking} ({packingPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${packingPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                        Budget
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(totalSpent, trip.currencySymbol)} / {formatCurrency(trip.budgetTotal, trip.currencySymbol)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-2">
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => handleOpenTrip(trip.id, 'overview')}
                        className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <span>Manage Active Vacation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenTrip(trip.id, 'overview')}
                        className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <Plane className="w-3.5 h-3.5 text-amber-400" />
                        <span>Switch to this Vacation</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preset Inspiration: One-Click Trip Starters */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Quick Destination Starters
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display mt-0.5">
              Add More Trips in One Click
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Choose from pre-built vacation packages complete with itineraries, to-do checklists, and packing essentials.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {TRIP_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-4 transition flex flex-col justify-between space-y-3 backdrop-blur-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{preset.iconText}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-white/20 rounded-md text-slate-200">
                    {preset.defaultDurationDays} Days
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-display line-clamp-1">
                  {preset.name}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                  {preset.tagline}
                </p>
                <div className="text-[11px] text-slate-400 mt-2 font-medium">
                  Budget: {preset.currencySymbol}{preset.budgetTotal.toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newTrip = createTripFromPreset(preset);
                  onAddPresetTrip(newTrip);
                }}
                className="w-full py-1.5 px-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to My Trips
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">
              Delete "{tripToDelete.title}"?
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to delete this vacation plan? All its itinerary events, to-do lists, packing items, and logged expenses will be removed.
            </p>

            {trips.length <= 1 && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg mt-3">
                Note: This is your only vacation plan. Deleting it will create a fresh blank vacation.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setTripToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs transition cursor-pointer"
              >
                Delete Vacation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
