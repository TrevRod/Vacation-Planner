/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trip, ActiveTab } from './types';
import { 
  loadTrips, 
  saveTrips, 
  loadActiveTripId, 
  saveActiveTripId 
} from './utils/storage';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { OverviewTab } from './components/OverviewTab';
import { ItineraryTab } from './components/ItineraryTab';
import { TodoListTab } from './components/TodoListTab';
import { PackingListTab } from './components/PackingListTab';
import { BudgetAndNotesTab } from './components/BudgetAndNotesTab';
import { TripsManagerTab } from './components/TripsManagerTab';
import { TripModal } from './components/TripModal';
import { PrintExportModal } from './components/PrintExportModal';
import { TRIP_PRESETS, createTripFromPreset } from './data/tripPresets';
import { Compass, Plus, Sparkles, Plane, Upload } from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(() => loadTrips());
  const [activeTripId, setActiveTripId] = useState<string>(() => loadActiveTripId(trips));
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modals
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTripForModal, setEditingTripForModal] = useState<Trip | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

  useEffect(() => {
    if (activeTripId) {
      saveActiveTripId(activeTripId);
    }
  }, [activeTripId]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  const handleSelectTrip = (id: string) => {
    setActiveTripId(id);
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    const updatedTrips = trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t));
    setTrips(updatedTrips);
  };

  const handleNewTrip = () => {
    setEditingTripForModal(null);
    setIsTripModalOpen(true);
  };

  const handleEditTrip = (tripToEdit?: Trip) => {
    setEditingTripForModal(tripToEdit || activeTrip);
    setIsTripModalOpen(true);
  };

  const handleDuplicateTrip = (tripId: string) => {
    const original = trips.find((t) => t.id === tripId);
    if (!original) return;

    const newId = `trip-${Date.now()}`;
    const duplicated: Trip = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      itinerary: original.itinerary.map((d, dIdx) => ({
        ...d,
        id: `day-${Date.now()}-${dIdx + 1}`,
        activities: d.activities.map((a, aIdx) => ({
          ...a,
          id: `act-${Date.now()}-${dIdx + 1}-${aIdx + 1}`
        }))
      })),
      todos: original.todos.map((t, tIdx) => ({
        ...t,
        id: `todo-${Date.now()}-${tIdx + 1}`
      })),
      packingList: original.packingList.map((p, pIdx) => ({
        ...p,
        id: `pack-${Date.now()}-${pIdx + 1}`
      })),
      expenses: original.expenses.map((e, eIdx) => ({
        ...e,
        id: `exp-${Date.now()}-${eIdx + 1}`
      }))
    };

    setTrips([duplicated, ...trips]);
    setActiveTripId(newId);
  };

  const handleDeleteTrip = (tripId: string) => {
    const remaining = trips.filter((t) => t.id !== tripId);
    setTrips(remaining);
    setActiveTripId(remaining[0]?.id || '');
  };

  const handleAddPresetTrip = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
    setActiveTripId(newTrip.id);
    setActiveTab('overview');
  };

  const handleSaveTripModal = (savedTrip: Trip) => {
    const exists = trips.some((t) => t.id === savedTrip.id);
    if (exists) {
      const updated = trips.map((t) => (t.id === savedTrip.id ? savedTrip : t));
      setTrips(updated);
    } else {
      setTrips([savedTrip, ...trips]);
      setActiveTripId(savedTrip.id);
      setActiveTab('overview');
    }
  };

  const handleToggleTodo = (todoId: string) => {
    if (!activeTrip) return;
    const updatedTodos = activeTrip.todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    handleUpdateTrip({ ...activeTrip, todos: updatedTodos });
  };

  const handleUpdateNotes = (notes: string) => {
    if (!activeTrip) return;
    handleUpdateTrip({ ...activeTrip, generalNotes: notes });
  };

  const handleImportTrip = (imported: Trip) => {
    setTrips([imported, ...trips]);
    setActiveTripId(imported.id);
    setActiveTab('overview');
  };

  // Zero-State: When all sample trips are removed and user has not created one yet
  if (!activeTrip || trips.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        {/* Simple Clean Header for Zero State */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-semibold">
                <Compass className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight font-display">
                  Vacation Planner
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Itinerary, to-do checklist, packing bags & travel budget
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Import JSON
              </button>
              <button
                type="button"
                onClick={handleNewTrip}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-xs font-bold text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Plan Vacation
              </button>
            </div>
          </div>
        </header>

        {/* Main Zero-State Body */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-center">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50">
              <Plane className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Ready to Plan Your Next Vacation?
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Create a custom vacation to organize your daily schedule, packing bag checklists, essential pre-trip to-dos, and budget.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleNewTrip}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-sm font-bold text-white transition cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Plan Your First Vacation
              </button>
            </div>
          </div>

          {/* Optional Starter Templates */}
          <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Need inspiration? Start from a destination package
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Click any template to quickly set up a vacation with pre-formatted itineraries and packing recommendations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRIP_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{preset.iconText}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                        {preset.defaultDurationDays} Days
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 font-display line-clamp-1">
                      {preset.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {preset.tagline}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddPresetTrip(createTripFromPreset(preset))}
                    className="mt-4 w-full py-1.5 px-2.5 bg-white hover:bg-amber-50 hover:text-amber-800 border border-slate-200 hover:border-amber-300 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Create Trip Modal */}
        <TripModal
          isOpen={isTripModalOpen}
          onClose={() => setIsTripModalOpen(false)}
          onSave={handleSaveTripModal}
          initialTrip={editingTripForModal}
        />

        {/* Share / Export / Print Modal */}
        <PrintExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          trip={null}
          onImportTrip={handleImportTrip}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* App & Vacation Header */}
      <Header
        trips={trips}
        activeTrip={activeTrip}
        onSelectTrip={handleSelectTrip}
        onNewTrip={handleNewTrip}
        onEditTrip={() => handleEditTrip(activeTrip)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenTripsManager={() => setActiveTab('trips')}
      />

      {/* Main Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        trip={activeTrip}
        tripsCount={trips.length}
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'trips' && (
          <TripsManagerTab
            trips={trips}
            activeTripId={activeTrip.id}
            onSelectTrip={handleSelectTrip}
            onNavigateTab={setActiveTab}
            onNewTrip={handleNewTrip}
            onEditTrip={handleEditTrip}
            onDuplicateTrip={handleDuplicateTrip}
            onDeleteTrip={handleDeleteTrip}
            onAddPresetTrip={handleAddPresetTrip}
          />
        )}

        {activeTab === 'overview' && (
          <OverviewTab
            trip={activeTrip}
            onNavigateTab={setActiveTab}
            onToggleTodo={handleToggleTodo}
            onUpdateNotes={handleUpdateNotes}
            tripsCount={trips.length}
            onNewTrip={handleNewTrip}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryTab
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {activeTab === 'todo' && (
          <TodoListTab
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {activeTab === 'packing' && (
          <PackingListTab
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetAndNotesTab
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}
      </main>

      {/* Create / Edit Trip Modal */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSave={handleSaveTripModal}
        initialTrip={editingTripForModal}
      />

      {/* Share / Export / Print Modal */}
      <PrintExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        trip={activeTrip}
        onImportTrip={handleImportTrip}
      />
    </div>
  );
}

