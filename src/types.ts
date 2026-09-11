export type ActivityCategory =
  | 'transport'
  | 'lodging'
  | 'sightseeing'
  | 'dining'
  | 'activity'
  | 'relaxation';

export interface ItineraryActivity {
  id: string;
  time: string; // e.g. "09:30"
  title: string;
  category: ActivityCategory;
  location: string;
  notes?: string;
  bookingRef?: string;
  cost?: number;
  completed?: boolean;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string; // e.g. "2026-07-14"
  title: string; // e.g. "Arrival in Naples & Drive to Positano"
  activities: ItineraryActivity[];
}

export type TodoCategory =
  | 'documents'
  | 'bookings'
  | 'health'
  | 'home'
  | 'finance'
  | 'work';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface TodoItem {
  id: string;
  title: string;
  category: TodoCategory;
  dueDateLabel?: string; // e.g. "2 weeks before" or "Jul 10"
  priority: PriorityLevel;
  completed: boolean;
  notes?: string;
}

export type PackingCategory =
  | 'clothing'
  | 'toiletries'
  | 'electronics'
  | 'documents'
  | 'health'
  | 'gear'
  | 'accessories';

export type BagType = 'carry-on' | 'checked' | 'personal-item';

export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategory;
  bagType: BagType;
  quantity: number;
  packed: boolean;
  essential?: boolean;
}

export type ExpenseCategory =
  | 'lodging'
  | 'flights-transit'
  | 'food-dining'
  | 'activities'
  | 'shopping'
  | 'other';

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes?: string;
}

export interface EmergencyInfo {
  embassyPhone?: string;
  policeLocal?: string;
  insurancePolicy?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface Trip {
  id: string;
  title: string; // e.g. "Amalfi Coast & Rome Getaway"
  destination: string; // e.g. "Amalfi Coast & Rome, Italy"
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  currency: string; // e.g. "EUR", "USD", "JPY"
  currencySymbol: string; // e.g. "€", "$", "¥"
  budgetTotal: number;
  coverGradient: string;
  generalNotes?: string;
  emergencyInfo: EmergencyInfo;
  itinerary: ItineraryDay[];
  todos: TodoItem[];
  packingList: PackingItem[];
  expenses: ExpenseItem[];
}

export type ActiveTab = 'trips' | 'overview' | 'itinerary' | 'todo' | 'packing' | 'budget';
