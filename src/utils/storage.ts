import { Trip } from '../types';
import { INITIAL_TRIPS } from '../data/initialData';

const STORAGE_KEY = 'vacation_planner_trips_v1';
const ACTIVE_TRIP_KEY = 'vacation_planner_active_trip_id_v1';

export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Remove any pre-existing sample trips from localStorage
      const userTrips = parsed.filter(
        (t) => t && t.id !== 'trip-amalfi-2026' && t.id !== 'trip-japan-2026'
      );
      if (userTrips.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userTrips));
      }
      return userTrips;
    }
    return [];
  } catch (err) {
    console.error('Error loading trips from localStorage:', err);
    return [];
  }
}

export function saveTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Error saving trips to localStorage:', err);
  }
}

export function loadActiveTripId(trips: Trip[]): string {
  try {
    const savedId = localStorage.getItem(ACTIVE_TRIP_KEY);
    if (savedId && trips.some((t) => t.id === savedId)) {
      return savedId;
    }
  } catch {
    // fallback
  }
  return trips[0]?.id || '';
}

export function saveActiveTripId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_TRIP_KEY, id);
  } catch (err) {
    console.error('Error saving active trip id:', err);
  }
}

export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

export function calculateDaysUntil(startDateStr: string): { label: string; status: 'upcoming' | 'ongoing' | 'past' } {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tripDate = new Date(startDateStr);
    tripDate.setHours(0, 0, 0, 0);

    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        label: `${diffDays} day${diffDays === 1 ? '' : 's'} to go`,
        status: 'upcoming'
      };
    } else if (diffDays === 0) {
      return {
        label: 'Departs Today!',
        status: 'ongoing'
      };
    } else {
      return {
        label: `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`,
        status: 'past'
      };
    }
  } catch {
    return { label: 'Upcoming', status: 'upcoming' };
  }
}

export function formatTripDates(startStr: string, endStr: string): string {
  try {
    const start = new Date(startStr + 'T00:00:00');
    const end = new Date(endStr + 'T00:00:00');

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = end.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} – ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
  } catch {
    return `${startStr} – ${endStr}`;
  }
}
