import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin, 
  PhoneCall, 
  ShieldAlert, 
  FileText, 
  ChevronRight, 
  Wallet, 
  Calendar,
  Luggage,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Globe,
  Plus,
  Share2
} from 'lucide-react';
import { Trip, ActiveTab } from '../types';
import { formatCurrency } from '../utils/storage';
import { DestinationWeatherCard } from './DestinationWeatherCard';
import { triggerHaptic } from '../utils/native';

interface OverviewTabProps {
  trip: Trip;
  onNavigateTab: (tab: ActiveTab) => void;
  onToggleTodo: (todoId: string) => void;
  onUpdateNotes: (notes: string) => void;
  tripsCount?: number;
  onNewTrip?: () => void;
  onOpenExport?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  trip,
  onNavigateTab,
  onToggleTodo,
  onUpdateNotes,
  tripsCount,
  onNewTrip,
  onOpenExport
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(trip.generalNotes || '');

  const totalTodos = trip.todos.length;
  const completedTodos = trip.todos.filter((t) => t.completed).length;
  const todoPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const totalPacking = trip.packingList.length;
  const packedItems = trip.packingList.filter((p) => p.packed).length;
  const packingPercentage = totalPacking > 0 ? Math.round((packedItems / totalPacking) * 100) : 0;

  const totalSpent = trip.expenses.reduce((sum, item) => sum + item.amount, 0);
  const budgetRemaining = trip.budgetTotal - totalSpent;
  const totalActivities = trip.itinerary.reduce((sum, day) => sum + day.activities.length, 0);

  const priorityTodos = trip.todos
    .filter((t) => !t.completed)
    .sort((a, b) => (a.priority === 'high' ? -1 : 1))
    .slice(0, 4);

  const firstDay = trip.itinerary[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(notesDraft);
    setIsEditingNotes(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Itinerary */}
        <div 
          onClick={() => onNavigateTab('itinerary')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Itinerary</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{trip.itinerary.length} Days</span>
            <span className="text-xs text-slate-500">({totalActivities} events)</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 group-hover:text-amber-700 transition">
            <span>View day-by-day plan</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Metric 2: Pre-Trip To-Dos */}
        <div 
          onClick={() => onNavigateTab('todo')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">To-Do Checklist</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{completedTodos} / {totalTodos}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
              {todoPercentage}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${todoPercentage}%` }} 
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 group-hover:text-amber-700 transition">
            <span>{totalTodos - completedTodos} tasks remaining</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Metric 3: Packing Progress */}
        <div 
          onClick={() => onNavigateTab('packing')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Packing List</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Luggage className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{packedItems} / {totalPacking}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
              {packingPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${packingPercentage}%` }} 
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 group-hover:text-amber-700 transition">
            <span>{totalPacking - packedItems} items left to pack</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Metric 4: Budget */}
        <div 
          onClick={() => onNavigateTab('budget')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trip Budget</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalSpent, trip.currencySymbol)}
            </span>
            <span className="text-xs text-slate-500">
              of {formatCurrency(trip.budgetTotal, trip.currencySymbol)}
            </span>
          </div>
          <p className={`text-xs mt-2 font-medium ${budgetRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {budgetRemaining >= 0 
              ? `${formatCurrency(budgetRemaining, trip.currencySymbol)} remaining` 
              : `${formatCurrency(Math.abs(budgetRemaining), trip.currencySymbol)} over budget`}
          </p>
        </div>
      </div>

      {/* Main Content Grid: Left 2 Cols (Itinerary Glance & Priority Todos) / Right 1 Col (Emergency & Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day 1 Sneak Peek */}
          {firstDay && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      Day {firstDay.dayNumber}
                    </span>
                    <span className="text-xs text-slate-500">{firstDay.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{firstDay.title}</h3>
                </div>
                <button
                  id="overview-view-full-itinerary-btn"
                  type="button"
                  onClick={() => onNavigateTab('itinerary')}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  Full Itinerary
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {firstDay.activities.slice(0, 3).map((act) => (
                  <div 
                    key={act.id} 
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 min-w-[62px] pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{act.time}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{act.title}</p>
                      {act.location && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="truncate">{act.location}</span>
                        </p>
                      )}
                    </div>
                    {act.cost ? (
                      <span className="text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200">
                        {formatCurrency(act.cost, trip.currencySymbol)}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Priority Pre-Trip Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Priority Pre-Trip Tasks</h3>
                <p className="text-xs text-slate-500 mt-0.5">Important items needing attention before departure</p>
              </div>
              <button
                id="overview-view-all-todos-btn"
                type="button"
                onClick={() => onNavigateTab('todo')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                View all ({trip.todos.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {priorityTodos.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-amber-500/70" />
                <p>All priority tasks are completed!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {priorityTodos.map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => {
                      triggerHaptic('success');
                      onToggleTodo(todo.id);
                    }}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-amber-50/40 hover:border-amber-200 transition cursor-pointer group"
                  >
                    <button 
                      type="button" 
                      className="mt-0.5 text-slate-300 group-hover:text-amber-600 transition"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                        {todo.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {todo.dueDateLabel && (
                          <span className="text-xs text-slate-500">
                            Due: {todo.dueDateLabel}
                          </span>
                        )}
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                          todo.priority === 'high' 
                            ? 'bg-rose-50 text-rose-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {todo.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Weather Forecast, Share Itinerary, Emergency Contacts & Trip Notes */}
        <div className="space-y-6">
          {/* Destination Weather Forecast */}
          <DestinationWeatherCard destination={trip.destination} />

          {/* Quick Share / Export Itinerary Card */}
          {onOpenExport && (
            <div className="bg-linear-to-br from-amber-500/10 via-amber-500/5 to-slate-50 rounded-2xl border border-amber-200/80 p-5 shadow-xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="w-4 h-4 text-amber-700" />
                  <h4 className="text-sm font-bold text-slate-900">Share Itinerary</h4>
                </div>
                <p className="text-xs text-slate-600">
                  Export companion WhatsApp summary, print PDF, or backup trip data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onOpenExport();
                }}
                className="shrink-0 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          )}

          {/* Emergency Contacts Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Travel Emergency Info</h3>
            </div>

            <div className="space-y-3 text-xs">
              {trip.emergencyInfo.policeLocal && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block font-medium">Local Police / Emergency</span>
                    <span className="text-slate-900 font-semibold text-sm">{trip.emergencyInfo.policeLocal}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(trip.emergencyInfo.policeLocal!, 'police')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title="Copy number"
                  >
                    {copiedKey === 'police' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {trip.emergencyInfo.embassyPhone && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-slate-400 block font-medium">Embassy / Consulate</span>
                    <span className="text-slate-900 font-semibold text-xs truncate block">{trip.emergencyInfo.embassyPhone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(trip.emergencyInfo.embassyPhone!, 'embassy')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 transition cursor-pointer shrink-0"
                    title="Copy number"
                  >
                    {copiedKey === 'embassy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {trip.emergencyInfo.insurancePolicy && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-slate-400 block font-medium">Travel Insurance Policy #</span>
                    <span className="text-slate-900 font-semibold text-xs truncate block">{trip.emergencyInfo.insurancePolicy}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(trip.emergencyInfo.insurancePolicy!, 'insurance')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 transition cursor-pointer shrink-0"
                    title="Copy policy #"
                  >
                    {copiedKey === 'insurance' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {trip.emergencyInfo.emergencyContactPhone && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-slate-400 block font-medium">Emergency Contact ({trip.emergencyInfo.emergencyContactName || 'Family'})</span>
                    <span className="text-slate-900 font-semibold text-xs truncate block">{trip.emergencyInfo.emergencyContactPhone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(trip.emergencyInfo.emergencyContactPhone!, 'contact')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 transition cursor-pointer shrink-0"
                    title="Copy phone"
                  >
                    {copiedKey === 'contact' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Notes Scratchpad */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Trip Notes & Tips</h3>
              </div>
              {!isEditingNotes ? (
                <button
                  type="button"
                  onClick={() => {
                    setNotesDraft(trip.generalNotes || '');
                    setIsEditingNotes(true);
                  }}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 cursor-pointer"
                >
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Save
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  id="overview-notes-textarea"
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add flight reminders, local customs, reservation notes, phrase list..."
                  rows={5}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 text-slate-800"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(false)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-3 py-1 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-amber-50/40 p-3 rounded-xl border border-amber-100/60">
                {trip.generalNotes || 'No notes added yet. Click edit to record key travel tips, addresses, or advice!'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Trip Navigation Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white font-display">
              {tripsCount && tripsCount > 1 
                ? `Managing ${tripsCount} Vacation Plans` 
                : 'Planning Multiple Trips?'}
            </h4>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Compare budgets, keep distinct itineraries, checklists, and packing bags for every upcoming trip.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab('trips')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer border border-slate-700"
          >
            Browse All Vacations
          </button>
          {onNewTrip && (
            <button
              type="button"
              onClick={onNewTrip}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
