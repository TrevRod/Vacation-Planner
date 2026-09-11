import React from 'react';
import { 
  Compass, 
  CalendarDays, 
  CheckSquare, 
  Luggage, 
  Wallet,
  Globe
} from 'lucide-react';
import { ActiveTab, Trip } from '../types';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  trip: Trip;
  tripsCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  trip,
  tripsCount
}) => {
  const pendingTodos = trip.todos.filter((t) => !t.completed).length;
  const packedCount = trip.packingList.filter((p) => p.packed).length;
  const totalPacking = trip.packingList.length;
  const totalActivities = trip.itinerary.reduce((acc, day) => acc + day.activities.length, 0);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'trips',
      label: 'All Vacations',
      icon: <Globe className="w-4 h-4" />,
      badge: tripsCount !== undefined ? tripsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 font-bold'
    },
    {
      id: 'overview',
      label: 'Trip Overview',
      icon: <Compass className="w-4 h-4" />
    },
    {
      id: 'itinerary',
      label: 'Itinerary',
      icon: <CalendarDays className="w-4 h-4" />,
      badge: totalActivities > 0 ? `${totalActivities}` : undefined,
      badgeColor: 'bg-sky-100 text-sky-800'
    },
    {
      id: 'todo',
      label: 'To-Do List',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingTodos > 0 ? `${pendingTodos} left` : '✓ Done',
      badgeColor: pendingTodos > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'packing',
      label: 'Packing List',
      icon: <Luggage className="w-4 h-4" />,
      badge: totalPacking > 0 ? `${packedCount}/${totalPacking}` : undefined,
      badgeColor: packedCount === totalPacking && totalPacking > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
    },
    {
      id: 'budget',
      label: 'Budget & Notes',
      icon: <Wallet className="w-4 h-4" />
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-amber-600' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tab.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
