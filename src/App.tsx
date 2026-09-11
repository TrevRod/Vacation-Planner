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
import { INITIAL_TRIPS } from './data/initialData';
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
    if (trips.length <= 1) {
      // Create a fresh blank vacation if deleting the only one
      const now = new Date();
      const inOneMonth = new Date();
      inOneMonth.setDate(now.getDate() + 30);
      const inOneMonthPlusWeek = new Date();
      inOneMonthPlusWeek.setDate(inOneMonth.getDate() + 7);

      const freshTrip: Trip = {
        id: `trip-${Date.now()}`,
        title: 'My Next Vacation',
        destination: 'Destination, Country',
        startDate: inOneMonth.toISOString().split('T')[0],
        endDate: inOneMonthPlusWeek.toISOString().split('T')[0],
        currency: 'USD',
        currencySymbol: '$',
        budgetTotal: 3000,
        coverGradient: 'from-amber-500/20 via-orange-500/10 to-sky-500/20',
        generalNotes: '',
        emergencyInfo: {
          policeLocal: '911'
        },
        itinerary: [
          {
            id: `day-${Date.now()}-1`,
            dayNumber: 1,
            date: inOneMonth.toISOString().split('T')[0],
            title: 'Arrival Day',
            activities: []
          }
        ],
        todos: [],
        packingList: [],
        expenses: []
      };
      setTrips([freshTrip]);
      setActiveTripId(freshTrip.id);
      return;
    }

    const remaining = trips.filter((t) => t.id !== tripId);
    setTrips(remaining);
    if (activeTripId === tripId) {
      setActiveTripId(remaining[0].id);
    }
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

  const handleResetDemo = () => {
    setTrips(INITIAL_TRIPS);
    setActiveTripId(INITIAL_TRIPS[0].id);
    setActiveTab('overview');
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

  if (!activeTrip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-600 mb-3">No vacations found.</p>
          <button
            onClick={handleResetDemo}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold cursor-pointer"
          >
            Load Sample Vacations
          </button>
        </div>
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
        onResetDemo={handleResetDemo}
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

