import { Trip } from '../types';
import { ESSENTIAL_PACKING_ITEMS, ESSENTIAL_TODO_ITEMS } from './initialData';

export interface TripPreset {
  id: string;
  name: string;
  tagline: string;
  destination: string;
  defaultDurationDays: number;
  currency: string;
  currencySymbol: string;
  budgetTotal: number;
  coverGradient: string;
  iconText: string;
  emergencyInfo: {
    policeLocal: string;
    embassyPhone: string;
    insurancePolicy?: string;
  };
  sampleDays: {
    title: string;
    activities: {
      time: string;
      title: string;
      category: 'transport' | 'lodging' | 'sightseeing' | 'dining' | 'activity' | 'relaxation';
      location: string;
      notes?: string;
      cost?: number;
    }[];
  }[];
  customTodos?: { title: string; category: 'documents' | 'bookings' | 'health' | 'home' | 'finance' | 'work'; priority: 'high' | 'medium' | 'low'; dueDateLabel: string }[];
  customPacking?: { name: string; category: 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'health' | 'gear' | 'accessories'; bagType: 'carry-on' | 'checked' | 'personal-item'; quantity: number; essential?: boolean }[];
}

export const TRIP_PRESETS: TripPreset[] = [
  {
    id: 'preset-paris-provence',
    name: 'Paris & Provence Cultural Escape',
    tagline: 'Art, historic cafes, high-speed TGV, and lavender fields',
    destination: 'Paris & Aix-en-Provence, France',
    defaultDurationDays: 7,
    currency: 'EUR',
    currencySymbol: '€',
    budgetTotal: 3400,
    coverGradient: 'from-rose-500/20 via-amber-500/10 to-indigo-500/20',
    iconText: '🥐',
    emergencyInfo: {
      policeLocal: '112 / 17',
      embassyPhone: '+33 1 43 12 22 22 (US Embassy Paris)',
      insurancePolicy: 'WorldNomads #WN-883192'
    },
    sampleDays: [
      {
        title: 'Arrival in the City of Light & Seine River Cruise',
        activities: [
          { time: '10:00', title: 'Land at Charles de Gaulle Airport (CDG)', category: 'transport', location: 'CDG Terminal 2E' },
          { time: '14:00', title: 'Check in at Hotel des Grands Boulevards', category: 'lodging', location: '2nd Arrondissement, Paris', cost: 240 },
          { time: '17:30', title: 'Sunset Vedettes du Pont Neuf Seine Cruise', category: 'sightseeing', location: 'Pont Neuf, Paris', cost: 18 },
          { time: '20:00', title: 'Dinner at Traditional Bistro Paul Bert', category: 'dining', location: '18 Rue Paul Bert, 11th Arr.', cost: 65 }
        ]
      },
      {
        title: 'Iconic Art & Historic Montmartre',
        activities: [
          { time: '09:00', title: 'Musée d’Orsay Impressionist Masterpieces', category: 'sightseeing', location: 'Esplanade Valéry Giscard d’Estaing', cost: 16 },
          { time: '13:00', title: 'Lunch & Fresh Baguettes at Jardin des Tuileries', category: 'dining', location: 'Tuileries Garden', cost: 14 },
          { time: '15:30', title: 'Climb to Sacré-Cœur & Artist Square', category: 'sightseeing', location: 'Montmartre', cost: 0 },
          { time: '19:30', title: 'Wine & Charcuterie Tasting', category: 'dining', location: 'Le Baron Rouge, Bastille', cost: 45 }
        ]
      },
      {
        title: 'TGV South to Sunny Provence',
        activities: [
          { time: '08:37', title: 'TGV inOui from Paris Gare de Lyon to Aix TGV', category: 'transport', location: 'Gare de Lyon', cost: 85 },
          { time: '13:00', title: 'Check in at Boutique Bastide Hotel', category: 'lodging', location: 'Aix-en-Provence', cost: 190 },
          { time: '16:00', title: 'Stroll Cours Mirabeau & Fountain Squares', category: 'relaxation', location: 'Historic Aix Center', cost: 0 }
        ]
      }
    ],
    customTodos: [
      { title: 'Reserve timed entry tickets for Musée d’Orsay & Louvre', category: 'bookings', priority: 'high', dueDateLabel: '3 weeks before' },
      { title: 'Book SNCF TGV train tickets on SNCF Connect app', category: 'bookings', priority: 'high', dueDateLabel: '4 weeks before' }
    ],
    customPacking: [
      { name: 'Chic Comfortable Walking Loafers', category: 'clothing', bagType: 'carry-on', quantity: 1, essential: true },
      { name: 'Type C / E European Plug Adapters', category: 'electronics', bagType: 'carry-on', quantity: 2, essential: true },
      { name: 'Crossbody Anti-Pickpocket Bag', category: 'accessories', bagType: 'personal-item', quantity: 1, essential: true }
    ]
  },
  {
    id: 'preset-maui-hawaii',
    name: 'Maui Island Beach & Volcano Retreat',
    tagline: 'Sunsets, sea turtles, Road to Hana waterfalls, and Haleakala crater',
    destination: 'Maui, Hawaii, USA',
    defaultDurationDays: 6,
    currency: 'USD',
    currencySymbol: '$',
    budgetTotal: 4200,
    coverGradient: 'from-emerald-500/20 via-teal-500/10 to-amber-500/20',
    iconText: '🌺',
    emergencyInfo: {
      policeLocal: '911',
      embassyPhone: 'Maui Memorial Medical Center: (808) 244-9056',
      insurancePolicy: 'BlueCross Travel Card #BC-2018273'
    },
    sampleDays: [
      {
        title: 'Aloha Arrival & Sunset Beach Walk',
        activities: [
          { time: '13:30', title: 'Arrive at Kahului Airport (OGG) & Pick Up Jeep', category: 'transport', location: 'OGG Car Rental Center', cost: 420 },
          { time: '16:00', title: 'Check in at Oceanfront Resort in Wailea', category: 'lodging', location: 'Wailea Alanui Dr', cost: 380 },
          { time: '18:15', title: 'Sunset Cocktails & Fresh Poke at Monkeypod Kitchen', category: 'dining', location: 'Wailea Gateway Center', cost: 75 }
        ]
      },
      {
        title: 'Molokini Crater Snorkel & Turtle Town',
        activities: [
          { time: '06:45', title: 'Catamaran Sailing to Molokini Crater', category: 'activity', location: 'Maalaea Harbor', cost: 145 },
          { time: '12:30', title: 'Fish Tacos at Coconut’s Fish Cafe', category: 'dining', location: 'Kihei, Maui', cost: 22 },
          { time: '15:00', title: 'Relax at Makena Big Beach', category: 'relaxation', location: 'Makena State Park', cost: 5 }
        ]
      },
      {
        title: 'Scenic Road to Hana Waterfalls',
        activities: [
          { time: '07:30', title: 'Start Road to Hana Drive via Paia Town', category: 'sightseeing', location: 'Hana Highway (Hwy 360)', cost: 0 },
          { time: '10:00', title: 'Twin Falls & Bamboo Forest Hike', category: 'activity', location: 'Mile Marker 2, Hana Hwy', cost: 10 },
          { time: '13:00', title: 'Wai’anapanapa Black Sand Beach Exploration', category: 'sightseeing', location: 'Wai’anapanapa State Park', cost: 15 }
        ]
      }
    ],
    customTodos: [
      { title: 'Reserve sunrise entry permit for Haleakala National Park (Recreation.gov)', category: 'bookings', priority: 'high', dueDateLabel: '60 days before' },
      { title: 'Reserve timed entry for Wai’anapanapa Black Sand Beach', category: 'bookings', priority: 'high', dueDateLabel: '30 days before' }
    ],
    customPacking: [
      { name: 'Reef-Safe Sunscreen (Hawaii law compliant)', category: 'toiletries', bagType: 'carry-on', quantity: 2, essential: true },
      { name: 'Waterproof Phone Pouch for Snorkeling', category: 'electronics', bagType: 'personal-item', quantity: 1, essential: true },
      { name: 'Sturdy Hiking Sandals / Water Shoes', category: 'clothing', bagType: 'checked', quantity: 1, essential: true }
    ]
  },
  {
    id: 'preset-swiss-alps',
    name: 'Swiss Alps & Mountain Rail Journey',
    tagline: 'Alpine peaks, glacier views, scenic cogwheels, and fondue',
    destination: 'Interlaken & Zermatt, Switzerland',
    defaultDurationDays: 6,
    currency: 'CHF',
    currencySymbol: 'CHF ',
    budgetTotal: 3900,
    coverGradient: 'from-blue-500/20 via-slate-500/10 to-amber-500/20',
    iconText: '🏔️',
    emergencyInfo: {
      policeLocal: '117 (Police) / 144 (Ambulance) / 1414 (Rega Alpine Rescue)',
      embassyPhone: '+41 31 357 70 11 (US Embassy Bern)',
      insurancePolicy: 'SwissCare International #SC-772910'
    },
    sampleDays: [
      {
        title: 'Scenic Train to Interlaken & Lake Brienz',
        activities: [
          { time: '10:15', title: 'Train from Zurich Airport (ZRH) to Interlaken Ost', category: 'transport', location: 'SBB Station ZRH', cost: 65 },
          { time: '14:00', title: 'Check in at Victoria-Jungfrau Grand Hotel', category: 'lodging', location: 'Höheweg 41, Interlaken', cost: 320 },
          { time: '16:00', title: 'Turquoise Lake Brienz Steamboat Cruise', category: 'sightseeing', location: 'Interlaken Ost Boat Quay', cost: 38 }
        ]
      },
      {
        title: 'Jungfraujoch - Top of Europe 3,454m',
        activities: [
          { time: '08:00', title: 'Eiger Express Tricable Gondola from Grindelwald Terminal', category: 'transport', location: 'Grindelwald Terminal', cost: 195 },
          { time: '10:30', title: 'Aletsch Glacier Ice Palace & Sphinx Observatory', category: 'sightseeing', location: 'Jungfraujoch', cost: 0 },
          { time: '13:00', title: 'Alpine Cheese Fondue Lunch', category: 'dining', location: 'Restaurant Crystal Jungfrau', cost: 42 }
        ]
      },
      {
        title: 'Matterhorn Panorama in Zermatt',
        activities: [
          { time: '09:00', title: 'Mountain train to car-free Zermatt village', category: 'transport', location: 'Täsch to Zermatt', cost: 18 },
          { time: '13:30', title: 'Gornergrat Cogwheel Railway to 3,089m Viewpoint', category: 'sightseeing', location: 'Gornergrat Bahn', cost: 110 },
          { time: '18:30', title: 'Valais Dried Beef & Swiss Wine Tasting', category: 'dining', location: 'Bahnhofstrasse Zermatt', cost: 55 }
        ]
      }
    ],
    customTodos: [
      { title: 'Purchase Swiss Travel Pass (consecutive 4 or 8 day)', category: 'bookings', priority: 'high', dueDateLabel: '2 weeks before' },
      { title: 'Check live mountain webcams before ascending Jungfraujoch', category: 'bookings', priority: 'medium', dueDateLabel: 'Morning of' }
    ],
    customPacking: [
      { name: 'Layered Gore-Tex Windproof Mountain Jacket', category: 'clothing', bagType: 'carry-on', quantity: 1, essential: true },
      { name: 'Polarized Sunglasses (glacier glare protection)', category: 'accessories', bagType: 'personal-item', quantity: 1, essential: true },
      { name: 'Thermal Base Layers & Wool Socks', category: 'clothing', bagType: 'checked', quantity: 3, essential: true }
    ]
  },
  {
    id: 'preset-costa-rica',
    name: 'Costa Rica Rainforest & Volcano Adventure',
    tagline: 'Canopy ziplining, geothermal hot springs, sloths, and Pacific sunsets',
    destination: 'Arenal Volcano & Manuel Antonio, Costa Rica',
    defaultDurationDays: 7,
    currency: 'USD',
    currencySymbol: '$',
    budgetTotal: 2600,
    coverGradient: 'from-emerald-600/20 via-lime-500/10 to-amber-500/20',
    iconText: '🦜',
    emergencyInfo: {
      policeLocal: '911',
      embassyPhone: '+506 2519-2000 (US Embassy San José)',
      insurancePolicy: 'TravelGuard #TG-382901'
    },
    sampleDays: [
      {
        title: 'Arrival in San José & Drive to Arenal Volcano',
        activities: [
          { time: '11:30', title: 'Arrive at Juan Santamaría Airport (SJO)', category: 'transport', location: 'SJO Airport', cost: 0 },
          { time: '13:30', title: 'Scenic 4WD Shuttle to La Fortuna', category: 'transport', location: 'Alajuela to Arenal', cost: 65 },
          { time: '17:00', title: 'Check in at Nayara Tented Camp with Volcano View', category: 'lodging', location: 'La Fortuna, San Carlos', cost: 260 },
          { time: '19:30', title: 'Tabacón Natural Geothermal Thermal Springs Soak', category: 'relaxation', location: 'Tabacon Hot Springs', cost: 85 }
        ]
      },
      {
        title: 'Mistico Hanging Bridges & Sloth Wildlife Tour',
        activities: [
          { time: '07:30', title: 'Guided Hanging Bridges Canopy Rainforest Walk', category: 'activity', location: 'Mistico Arenal Park', cost: 42 },
          { time: '12:00', title: 'Traditional Casado Lunch (rice, black beans, plantains)', category: 'dining', location: 'Soda La Parada, La Fortuna', cost: 12 },
          { time: '14:30', title: 'La Fortuna 70-meter Waterfall Swim', category: 'activity', location: 'Catarata Fortuna', cost: 18 }
        ]
      },
      {
        title: 'Manuel Antonio National Park & Coastal Wildlife',
        activities: [
          { time: '09:00', title: 'Transfer to Central Pacific Coast', category: 'transport', location: 'La Fortuna to Manuel Antonio', cost: 75 },
          { time: '14:00', title: 'Spotting Capuchin Monkeys & Sloths on Cathedral Point Trail', category: 'activity', location: 'Manuel Antonio National Park', cost: 18 },
          { time: '17:30', title: 'Playa Espadilla Sunset Seafood Dinner', category: 'dining', location: 'Manuel Antonio Beachfront', cost: 40 }
        ]
      }
    ],
    customTodos: [
      { title: 'Book official Manuel Antonio National Park entrance tickets (SINAC portal)', category: 'bookings', priority: 'high', dueDateLabel: '3 weeks before' },
      { title: 'Check yellow fever vaccination recommendations if coming from endemic areas', category: 'health', priority: 'high', dueDateLabel: '4 weeks before' }
    ],
    customPacking: [
      { name: 'DEET / Picaridin Insect Repellent Spray', category: 'health', bagType: 'carry-on', quantity: 2, essential: true },
      { name: 'Lightweight Quick-Dry Moisture Wicking Shirts', category: 'clothing', bagType: 'checked', quantity: 5, essential: true },
      { name: 'Waterproof Dry-Bag (10L) for River Activities', category: 'gear', bagType: 'carry-on', quantity: 1, essential: true }
    ]
  }
];

export function createTripFromPreset(preset: TripPreset, startDateOffsetDays = 30): Trip {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() + startDateOffsetDays);
  const end = new Date(start);
  end.setDate(start.getDate() + preset.defaultDurationDays);

  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];

  const generatedDays = preset.sampleDays.map((sampleDay, idx) => {
    const d = new Date(start);
    d.setDate(start.getDate() + idx);
    const dayStr = d.toISOString().split('T')[0];

    return {
      id: `day-${Date.now()}-${idx + 1}`,
      dayNumber: idx + 1,
      date: dayStr,
      title: sampleDay.title,
      activities: sampleDay.activities.map((act, actIdx) => ({
        id: `act-${Date.now()}-${idx + 1}-${actIdx + 1}`,
        time: act.time,
        title: act.title,
        category: act.category,
        location: act.location,
        notes: act.notes,
        cost: act.cost || 0,
        completed: false
      }))
    };
  });

  // Merge base essential items with preset custom items
  const todos = [
    ...(preset.customTodos || []).map((t, idx) => ({
      ...t,
      id: `todo-preset-${Date.now()}-${idx}`,
      completed: false
    })),
    ...ESSENTIAL_TODO_ITEMS.map((t, idx) => ({
      ...t,
      id: `todo-ess-${Date.now()}-${idx}`,
      completed: false
    }))
  ];

  const packingList = [
    ...(preset.customPacking || []).map((p, idx) => ({
      ...p,
      id: `pack-preset-${Date.now()}-${idx}`,
      packed: false
    })),
    ...ESSENTIAL_PACKING_ITEMS.map((p, idx) => ({
      ...p,
      id: `pack-ess-${Date.now()}-${idx}`,
      packed: false
    }))
  ];

  return {
    id: `trip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: preset.name,
    destination: preset.destination,
    startDate: startStr,
    endDate: endStr,
    currency: preset.currency,
    currencySymbol: preset.currencySymbol,
    budgetTotal: preset.budgetTotal,
    coverGradient: preset.coverGradient,
    generalNotes: `Trip notes for ${preset.name}:\n- Highlight activities and advance reservations\n- Local transit tips: Keep maps downloaded offline\n- Emergency numbers: ${preset.emergencyInfo.policeLocal}`,
    emergencyInfo: {
      policeLocal: preset.emergencyInfo.policeLocal,
      embassyPhone: preset.emergencyInfo.embassyPhone,
      insurancePolicy: preset.emergencyInfo.insurancePolicy
    },
    itinerary: generatedDays,
    todos,
    packingList,
    expenses: []
  };
}
