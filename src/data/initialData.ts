import { Trip, PackingItem, TodoItem } from '../types';

export const ESSENTIAL_PACKING_ITEMS: Omit<PackingItem, 'id'>[] = [
  { name: 'Passport & Visa (if needed)', category: 'documents', bagType: 'personal-item', quantity: 1, packed: false, essential: true },
  { name: 'Driver’s License & ID', category: 'documents', bagType: 'personal-item', quantity: 1, packed: false, essential: true },
  { name: 'Credit Cards & Travel Cash', category: 'documents', bagType: 'personal-item', quantity: 2, packed: false, essential: true },
  { name: 'Travel Insurance Documents', category: 'documents', bagType: 'personal-item', quantity: 1, packed: false, essential: true },
  { name: 'Smartphone & Charging Cable', category: 'electronics', bagType: 'personal-item', quantity: 1, packed: false, essential: true },
  { name: 'Portable Power Bank (10,000mAh)', category: 'electronics', bagType: 'carry-on', quantity: 1, packed: false, essential: true },
  { name: 'Universal Travel Plug Adapter', category: 'electronics', bagType: 'carry-on', quantity: 2, packed: false, essential: true },
  { name: 'Noise-Canceling Headphones', category: 'electronics', bagType: 'personal-item', quantity: 1, packed: false, essential: false },
  { name: 'Toothbrush & Travel Toothpaste', category: 'toiletries', bagType: 'carry-on', quantity: 1, packed: false, essential: true },
  { name: 'Sunscreen (SPF 50+ Broad Spectrum)', category: 'toiletries', bagType: 'carry-on', quantity: 1, packed: false, essential: true },
  { name: 'Personal Medications & Prescriptions', category: 'health', bagType: 'personal-item', quantity: 1, packed: false, essential: true },
  { name: 'First Aid Kit & Pain Relievers', category: 'health', bagType: 'carry-on', quantity: 1, packed: false, essential: false },
  { name: 'Electrolyte Packets & Bandages', category: 'health', bagType: 'carry-on', quantity: 4, packed: false, essential: false },
  { name: 'Lightweight Breathable Shirts', category: 'clothing', bagType: 'checked', quantity: 5, packed: false, essential: false },
  { name: 'Comfortable Walking Sneakers', category: 'clothing', bagType: 'carry-on', quantity: 1, packed: false, essential: true },
  { name: 'Swimwear & Quick-Dry Towel', category: 'clothing', bagType: 'checked', quantity: 2, packed: false, essential: false },
  { name: 'Sunglasses with UV Protection', category: 'accessories', bagType: 'personal-item', quantity: 1, packed: false, essential: true },
  { name: 'Foldable Reusable Daypack / Tote', category: 'gear', bagType: 'carry-on', quantity: 1, packed: false, essential: false },
  { name: 'Compact Travel Umbrella / Rain Shell', category: 'gear', bagType: 'carry-on', quantity: 1, packed: false, essential: false },
  { name: 'Refillable Water Bottle (Insulated)', category: 'gear', bagType: 'personal-item', quantity: 1, packed: false, essential: false }
];

export const ESSENTIAL_TODO_ITEMS: Omit<TodoItem, 'id'>[] = [
  { title: 'Check passport validity (must have 6+ months remaining)', category: 'documents', dueDateLabel: '4 weeks before', priority: 'high', completed: false, notes: 'US passports require 6 months validity for EU/Schengen entry' },
  { title: 'Notify bank & credit cards of travel dates', category: 'finance', dueDateLabel: '1 week before', priority: 'medium', completed: false, notes: 'Avoid automated fraud card freezes abroad' },
  { title: 'Purchase travel medical & trip cancellation insurance', category: 'documents', dueDateLabel: '3 weeks before', priority: 'high', completed: false },
  { title: 'Order international eSIM or activate roaming pass', category: 'work', dueDateLabel: '3 days before', priority: 'high', completed: false, notes: 'Airalo or carrier day-pass' },
  { title: 'Arrange pet sitting / house sitting', category: 'home', dueDateLabel: '2 weeks before', priority: 'high', completed: false },
  { title: 'Download offline maps (Google Maps & city transit)', category: 'bookings', dueDateLabel: '2 days before', priority: 'medium', completed: false },
  { title: 'Photocopy passports and store digital copies in secure cloud', category: 'documents', dueDateLabel: '1 week before', priority: 'medium', completed: false },
  { title: 'Put mail and package deliveries on postal hold', category: 'home', dueDateLabel: '3 days before', priority: 'low', completed: false },
  { title: 'Confirm hotel reservations & airport transfer timings', category: 'bookings', dueDateLabel: '5 days before', priority: 'high', completed: false },
  { title: 'Refill 30-day prescription medications', category: 'health', dueDateLabel: '2 weeks before', priority: 'high', completed: false }
];

export const INITIAL_TRIPS: Trip[] = [];
