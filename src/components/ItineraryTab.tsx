import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Circle,
  Car,
  Bed,
  Utensils,
  Camera,
  Coffee,
  Compass,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Trip, ItineraryDay, ItineraryActivity, ActivityCategory } from '../types';
import { formatCurrency } from '../utils/storage';

interface ItineraryTabProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

const CATEGORY_CONFIG: Record<
  ActivityCategory,
  { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  transport: {
    label: 'Transport',
    icon: <Car className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  lodging: {
    label: 'Lodging',
    icon: <Bed className="w-3.5 h-3.5" />,
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200'
  },
  sightseeing: {
    label: 'Sightseeing',
    icon: <Camera className="w-3.5 h-3.5" />,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  dining: {
    label: 'Food & Dining',
    icon: <Utensils className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  activity: {
    label: 'Activity & Tours',
    icon: <Compass className="w-3.5 h-3.5" />,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200'
  },
  relaxation: {
    label: 'Relaxation',
    icon: <Coffee className="w-3.5 h-3.5" />,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200'
  }
};

export const ItineraryTab: React.FC<ItineraryTabProps> = ({ trip, onUpdateTrip }) => {
  const [selectedDayId, setSelectedDayId] = useState<string>(
    trip.itinerary[0]?.id || ''
  );
  const [filterCategory, setFilterCategory] = useState<ActivityCategory | 'all'>('all');

  // Modal / Form state for Activity
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ItineraryActivity | null>(null);
  
  // Activity Form fields
  const [actTitle, setActTitle] = useState('');
  const [actTime, setActTime] = useState('09:00');
  const [actCategory, setActCategory] = useState<ActivityCategory>('sightseeing');
  const [actLocation, setActLocation] = useState('');
  const [actNotes, setActNotes] = useState('');
  const [actBookingRef, setActBookingRef] = useState('');
  const [actCost, setActCost] = useState<string>('');

  // Editing day title
  const [isEditingDayTitle, setIsEditingDayTitle] = useState(false);
  const [dayTitleDraft, setDayTitleDraft] = useState('');

  const activeDay = trip.itinerary.find((d) => d.id === selectedDayId) || trip.itinerary[0];

  const handleSelectDay = (dayId: string) => {
    setSelectedDayId(dayId);
    setIsEditingDayTitle(false);
  };

  const handleAddDay = () => {
    const newDayNumber = trip.itinerary.length + 1;
    // Calculate estimated date from trip start
    const startDate = new Date(trip.startDate + 'T00:00:00');
    startDate.setDate(startDate.getDate() + (newDayNumber - 1));
    const dateStr = startDate.toISOString().split('T')[0];

    const newDay: ItineraryDay = {
      id: `day-${Date.now()}`,
      dayNumber: newDayNumber,
      date: dateStr,
      title: `Day ${newDayNumber} Exploration`,
      activities: []
    };

    const updatedItinerary = [...trip.itinerary, newDay];
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
    setSelectedDayId(newDay.id);
  };

  const handleDeleteDay = (dayId: string) => {
    if (trip.itinerary.length <= 1) {
      alert('You must keep at least one day in the itinerary.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this day and all its activities?')) {
      return;
    }
    const filtered = trip.itinerary
      .filter((d) => d.id !== dayId)
      .map((d, index) => ({
        ...d,
        dayNumber: index + 1
      }));

    onUpdateTrip({ ...trip, itinerary: filtered });
    setSelectedDayId(filtered[0]?.id || '');
  };

  const handleSaveDayTitle = () => {
    if (!activeDay) return;
    const updatedItinerary = trip.itinerary.map((d) =>
      d.id === activeDay.id ? { ...d, title: dayTitleDraft.trim() || d.title } : d
    );
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
    setIsEditingDayTitle(false);
  };

  const openAddActivityModal = () => {
    setEditingActivity(null);
    setActTitle('');
    setActTime('10:00');
    setActCategory('sightseeing');
    setActLocation('');
    setActNotes('');
    setActBookingRef('');
    setActCost('');
    setIsActivityModalOpen(true);
  };

  const openEditActivityModal = (activity: ItineraryActivity) => {
    setEditingActivity(activity);
    setActTitle(activity.title);
    setActTime(activity.time);
    setActCategory(activity.category);
    setActLocation(activity.location);
    setActNotes(activity.notes || '');
    setActBookingRef(activity.bookingRef || '');
    setActCost(activity.cost !== undefined ? String(activity.cost) : '');
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDay || !actTitle.trim()) return;

    const parsedCost = actCost.trim() ? parseFloat(actCost) : undefined;

    if (editingActivity) {
      // Edit existing
      const updatedActivities = activeDay.activities.map((a) =>
        a.id === editingActivity.id
          ? {
              ...a,
              title: actTitle.trim(),
              time: actTime,
              category: actCategory,
              location: actLocation.trim(),
              notes: actNotes.trim() || undefined,
              bookingRef: actBookingRef.trim() || undefined,
              cost: isNaN(parsedCost || 0) ? undefined : parsedCost
            }
          : a
      );
      const updatedItinerary = trip.itinerary.map((d) =>
        d.id === activeDay.id ? { ...d, activities: updatedActivities } : d
      );
      onUpdateTrip({ ...trip, itinerary: updatedItinerary });
    } else {
      // Add new
      const newActivity: ItineraryActivity = {
        id: `act-${Date.now()}`,
        title: actTitle.trim(),
        time: actTime,
        category: actCategory,
        location: actLocation.trim(),
        notes: actNotes.trim() || undefined,
        bookingRef: actBookingRef.trim() || undefined,
        cost: isNaN(parsedCost || 0) ? undefined : parsedCost,
        completed: false
      };
      // Sort by time ascending
      const newActivities = [...activeDay.activities, newActivity].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
      const updatedItinerary = trip.itinerary.map((d) =>
        d.id === activeDay.id ? { ...d, activities: newActivities } : d
      );
      onUpdateTrip({ ...trip, itinerary: updatedItinerary });
    }

    setIsActivityModalOpen(false);
  };

  const handleDeleteActivity = (actId: string) => {
    if (!activeDay) return;
    const updatedActivities = activeDay.activities.filter((a) => a.id !== actId);
    const updatedItinerary = trip.itinerary.map((d) =>
      d.id === activeDay.id ? { ...d, activities: updatedActivities } : d
    );
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
  };

  const handleToggleActivityCompleted = (actId: string) => {
    if (!activeDay) return;
    const updatedActivities = activeDay.activities.map((a) =>
      a.id === actId ? { ...a, completed: !a.completed } : a
    );
    const updatedItinerary = trip.itinerary.map((d) =>
      d.id === activeDay.id ? { ...d, activities: updatedActivities } : d
    );
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
  };

  const handleMoveActivity = (actId: string, direction: 'up' | 'down') => {
    if (!activeDay) return;
    const items = [...activeDay.activities];
    const index = items.findIndex((a) => a.id === actId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const updatedItinerary = trip.itinerary.map((d) =>
      d.id === activeDay.id ? { ...d, activities: items } : d
    );
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
  };

  // Filter activities
  const displayedActivities = (activeDay?.activities || []).filter((a) => {
    if (filterCategory === 'all') return true;
    return a.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Day Selector Navigation Carousel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Trip Timeline ({trip.itinerary.length} Days)
          </span>
          <button
            id="itinerary-add-day-btn"
            type="button"
            onClick={handleAddDay}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/70 px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Day
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {trip.itinerary.map((day) => {
            const isSelected = day.id === selectedDayId;
            return (
              <button
                key={day.id}
                id={`day-pill-${day.id}`}
                type="button"
                onClick={() => handleSelectDay(day.id)}
                className={`flex-shrink-0 text-left p-3 rounded-xl border transition cursor-pointer min-w-[120px] sm:min-w-[140px] ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                    Day {day.dayNumber}
                  </span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {day.activities.length}
                  </span>
                </div>
                <p className={`text-xs mt-1 truncate font-medium ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {day.date}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Header & Actions */}
      {activeDay && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  Day {activeDay.dayNumber}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {activeDay.date}
                </span>
              </div>

              {isEditingDayTitle ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={dayTitleDraft}
                    onChange={(e) => setDayTitleDraft(e.target.value)}
                    className="text-lg font-bold text-slate-900 border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-amber-500"
                    placeholder="Day title..."
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveDayTitle}
                    className="px-2.5 py-1 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingDayTitle(false)}
                    className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                    {activeDay.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setDayTitleDraft(activeDay.title);
                      setIsEditingDayTitle(true);
                    }}
                    title="Rename day"
                    className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {trip.itinerary.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteDay(activeDay.id)}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-medium transition cursor-pointer"
                  title="Remove this day from itinerary"
                >
                  Delete Day
                </button>
              )}
              <button
                id="itinerary-add-activity-btn"
                type="button"
                onClick={openAddActivityModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>
          </div>

          {/* Category Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({activeDay.activities.length})
            </button>
            {(Object.keys(CATEGORY_CONFIG) as ActivityCategory[]).map((cat) => {
              const count = activeDay.activities.filter((a) => a.category === cat).length;
              const isSelected = filterCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition cursor-pointer ${
                    isSelected
                      ? `${CATEGORY_CONFIG[cat].bg} ${CATEGORY_CONFIG[cat].text} border ${CATEGORY_CONFIG[cat].border}`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{CATEGORY_CONFIG[cat].icon}</span>
                  <span>{CATEGORY_CONFIG[cat].label}</span>
                  {count > 0 && <span className="opacity-75">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Activity Timeline List */}
          {displayedActivities.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 my-4 bg-slate-50/50">
              <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <h4 className="text-sm font-semibold text-slate-800">No events scheduled yet for this day</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Add flights, hotel check-ins, tours, restaurant bookings, or relaxing sights.
              </p>
              <button
                type="button"
                onClick={openAddActivityModal}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                Add First Activity
              </button>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-200 space-y-4 my-4">
              {displayedActivities.map((act, index) => {
                const catInfo = CATEGORY_CONFIG[act.category];
                return (
                  <div
                    key={act.id}
                    id={`activity-item-${act.id}`}
                    className={`relative rounded-2xl border p-4 sm:p-5 transition ${
                      act.completed
                        ? 'bg-slate-50/70 border-slate-200 opacity-75'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Circle Node on the timeline */}
                    <div 
                      onClick={() => handleToggleActivityCompleted(act.id)}
                      title={act.completed ? 'Mark as incomplete' : 'Mark as completed'}
                      className={`absolute -left-[31px] sm:-left-[39px] top-5 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition ${
                        act.completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white border-2 border-amber-400 text-amber-600 hover:scale-110'
                      }`}
                    >
                      {act.completed ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    </div>

                    {/* Activity Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {act.time}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${catInfo.bg} ${catInfo.text} border ${catInfo.border}`}>
                          {catInfo.icon}
                          {catInfo.label}
                        </span>
                        {act.cost !== undefined && act.cost > 0 && (
                          <span className="text-xs font-semibold text-slate-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            {formatCurrency(act.cost, trip.currencySymbol)}
                          </span>
                        )}
                        {act.bookingRef && (
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            <Bookmark className="w-3 h-3 text-slate-400" />
                            Ref: {act.bookingRef}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 self-end sm:self-start">
                        {/* Move Up/Down buttons */}
                        <button
                          type="button"
                          onClick={() => handleMoveActivity(act.id, 'up')}
                          disabled={index === 0}
                          title="Move up"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveActivity(act.id, 'down')}
                          disabled={index === displayedActivities.length - 1}
                          title="Move down"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditActivityModal(act)}
                          title="Edit activity"
                          className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteActivity(act.id)}
                          title="Delete activity"
                          className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Location */}
                    <div className="mt-2">
                      <h3 className={`text-base font-bold text-slate-900 ${act.completed ? 'line-through text-slate-500' : ''}`}>
                        {act.title}
                      </h3>
                      {act.location && (
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{act.location}</span>
                        </p>
                      )}
                      {act.notes && (
                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 whitespace-pre-line leading-relaxed">
                          {act.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Activity Add/Edit Modal */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingActivity ? 'Edit Itinerary Event' : 'Add Itinerary Event'}
            </h3>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Event Title *
                </label>
                <input
                  id="activity-title-input"
                  type="text"
                  required
                  placeholder="e.g. Ferry to Capri, Colosseum VIP tour, Dinner reservation..."
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Time & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={actCategory}
                    onChange={(e) => setActCategory(e.target.value as ActivityCategory)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="sightseeing">🏛️ Sightseeing</option>
                    <option value="dining">🍽️ Food & Dining</option>
                    <option value="transport">✈️ / 🚢 Transport</option>
                    <option value="lodging">🏨 Lodging</option>
                    <option value="activity">🏄‍♂️ Activity & Tour</option>
                    <option value="relaxation">☕ Relaxation</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Piazza del Colosseo 1, Rome"
                  value={actLocation}
                  onChange={(e) => setActLocation(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Booking Reference & Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Booking / Confirmation #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CONF-8921B"
                    value={actBookingRef}
                    onChange={(e) => setActBookingRef(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Estimated Cost ({trip.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={actCost}
                    onChange={(e) => setActCost(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Notes & Helpful Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Dress code, ticket meeting spot, tickets saved on phone, key contacts..."
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-activity-submit-btn"
                  type="submit"
                  className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
                >
                  {editingActivity ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
