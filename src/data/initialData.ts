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

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-amalfi-2026',
    title: 'Amalfi Coast & Rome Adventure',
    destination: 'Positano, Amalfi & Rome, Italy',
    startDate: '2026-07-14',
    endDate: '2026-07-22',
    currency: 'EUR',
    currencySymbol: '€',
    budgetTotal: 3800,
    coverGradient: 'from-amber-500/20 via-orange-500/10 to-sky-500/20',
    generalNotes: 'Remember to validate train tickets at yellow machines before boarding Trenitalia trains. Cash is helpful for smaller cafes in Positano and Ravello. Tipping: 5-10% round-up for good restaurant service.',
    emergencyInfo: {
      embassyPhone: '+39 06 46741 (US Embassy Rome)',
      policeLocal: '112 (European emergency universal number)',
      insurancePolicy: 'Allianz Global Travel #AG-9482103',
      emergencyContactName: 'Elena Bianchi (Host) / Brother David',
      emergencyContactPhone: '+1 (555) 382-9011'
    },
    itinerary: [
      {
        id: 'day-1',
        dayNumber: 1,
        date: '2026-07-14',
        title: 'Arrival in Naples & Scenic Drive to Positano',
        activities: [
          {
            id: 'act-1-1',
            time: '11:45',
            title: 'Land at Naples International Airport (NAP)',
            category: 'transport',
            location: 'Naples Airport Terminal 1',
            notes: 'Flight AZ1280. Pick up checked luggage at Carousel 3.',
            bookingRef: 'AZ-1280-FL',
            cost: 0,
            completed: true
          },
          {
            id: 'act-1-2',
            time: '13:00',
            title: 'Private Shuttle Transfer along the Amalfi Drive',
            category: 'transport',
            location: 'Naples to Positano cliffside route',
            notes: 'Driver Marco holding name sign at exit door B. Spectacular coastal viewpoints.',
            bookingRef: 'TRANSFER-POS-77',
            cost: 130,
            completed: false
          },
          {
            id: 'act-1-3',
            time: '15:30',
            title: 'Check-in at Villa Rosa overlooking the Tyrrhenian Sea',
            category: 'lodging',
            location: 'Via Panoramica 14, Positano',
            notes: 'Room 204 with private bougainvillea balcony. Key code: 4812#.',
            bookingRef: 'VR-84920',
            cost: 380,
            completed: false
          },
          {
            id: 'act-1-4',
            time: '19:30',
            title: 'Sunset Welcome Dinner at Da Vincenzo',
            category: 'dining',
            location: 'Viale Pasitea 172, Positano',
            notes: 'Seafood paccheri and local lemon sorbet. Terrace seating reserved.',
            bookingRef: 'RES-VINCENZO-8',
            cost: 95,
            completed: false
          }
        ]
      },
      {
        id: 'day-2',
        dayNumber: 2,
        date: '2026-07-15',
        title: 'Capri Day Cruise & Blue Grotto',
        activities: [
          {
            id: 'act-2-1',
            time: '08:45',
            title: 'Board Morning Ferry to Marina Grande, Capri',
            category: 'transport',
            location: 'Positano Marina Molo',
            notes: 'NLG Hydrofoil ferry. Arrive 20 min early.',
            bookingRef: 'NLG-CAP-209',
            cost: 48,
            completed: false
          },
          {
            id: 'act-2-2',
            time: '10:30',
            title: 'Private Gozzo Boat Tour & Faraglioni Rocks',
            category: 'activity',
            location: 'Marina Grande Pier 4',
            notes: 'Skipper Luca. Swimming stops in Green Cave and White Grotto.',
            bookingRef: 'CAPRI-CRUISE-99',
            cost: 220,
            completed: false
          },
          {
            id: 'act-2-3',
            time: '13:30',
            title: 'Lunch at Lo Scoglio / Anacapri Piazza',
            category: 'dining',
            location: 'Anacapri Town Square',
            notes: 'Fresh caprese salad and handmade pasta.',
            cost: 65,
            completed: false
          },
          {
            id: 'act-2-4',
            time: '15:30',
            title: 'Chairlift up to Monte Solaro Panoramic Summit',
            category: 'sightseeing',
            location: 'Piazza Vittoria, Anacapri',
            notes: 'Highest point on Capri with 360-degree views of the bay.',
            cost: 14,
            completed: false
          }
        ]
      },
      {
        id: 'day-3',
        dayNumber: 3,
        date: '2026-07-16',
        title: 'Path of the Gods Hike & Ravello Gardens',
        activities: [
          {
            id: 'act-3-1',
            time: '07:30',
            title: 'Hike "Sentiero degli Dei" (Path of the Gods)',
            category: 'activity',
            location: 'Bomerano to Nocelle Trailhead',
            notes: 'Wear sturdy trail runners. Bring 2L water and sun hat. 3.5 hours trail.',
            cost: 0,
            completed: false
          },
          {
            id: 'act-3-2',
            time: '12:00',
            title: 'Lemon Slush & Focaccia in Nocelle',
            category: 'dining',
            location: 'Chiosco del Sentiero',
            notes: 'Famous cliffside lemon granita reward.',
            cost: 12,
            completed: false
          },
          {
            id: 'act-3-3',
            time: '15:00',
            title: 'Villa Rufolo Gardens in Ravello',
            category: 'sightseeing',
            location: 'Piazza Vescovado, Ravello',
            notes: 'Historic gardens that inspired Richard Wagner.',
            cost: 18,
            completed: false
          }
        ]
      },
      {
        id: 'day-4',
        dayNumber: 4,
        date: '2026-07-17',
        title: 'Frecciarossa High-Speed Train to Eternal Rome',
        activities: [
          {
            id: 'act-4-1',
            time: '10:30',
            title: 'Train to Rome Termini (Trenitalia Frecciarossa)',
            category: 'transport',
            location: 'Salerno Station to Roma Termini',
            notes: 'Coach 4, Seats 21A & 21B. 1hr 40min direct transit.',
            bookingRef: 'FR-9512-ROM',
            cost: 78,
            completed: false
          },
          {
            id: 'act-4-2',
            time: '13:30',
            title: 'Check-in at Hotel Donna Camilla Savelli',
            category: 'lodging',
            location: 'Via Garibaldi 27, Trastevere, Rome',
            notes: 'Historic 17th-century monastery designed by Borromini.',
            bookingRef: 'HTL-DCS-331',
            cost: 290,
            completed: false
          },
          {
            id: 'act-4-3',
            time: '17:00',
            title: 'VIP Colosseum & Roman Forum Twilight Tour',
            category: 'sightseeing',
            location: 'Piazza del Colosseo',
            notes: 'Gladiator arena floor access & underground chambers.',
            bookingRef: 'ROM-COLO-VIP44',
            cost: 140,
            completed: false
          },
          {
            id: 'act-4-4',
            time: '20:30',
            title: 'Authentic Cacio e Pepe in Trastevere',
            category: 'dining',
            location: 'Da Enzo al 29, Trastevere',
            notes: 'Arrive 15 min before opening to avoid queues.',
            cost: 55,
            completed: false
          }
        ]
      }
    ],
    todos: [
      {
        id: 'todo-1',
        title: 'Check passport expiry (must be valid through Jan 2027)',
        category: 'documents',
        dueDateLabel: 'Completed',
        priority: 'high',
        completed: true,
        notes: 'Passports verified, valid for 3+ years'
      },
      {
        id: 'todo-2',
        title: 'Purchase Trenitalia high-speed train tickets Salerno -> Rome',
        category: 'bookings',
        dueDateLabel: 'Completed',
        priority: 'high',
        completed: true,
        notes: 'Booked coach 4 seats'
      },
      {
        id: 'todo-3',
        title: 'Notify credit cards & Charles Schwab checking for ATM fee refunds in Italy',
        category: 'finance',
        dueDateLabel: '3 days before',
        priority: 'high',
        completed: false,
        notes: 'No foreign transaction fee cards preferred'
      },
      {
        id: 'todo-4',
        title: 'Book pet sitter for cat (Whiskers) July 14-22',
        category: 'home',
        dueDateLabel: '1 week before',
        priority: 'high',
        completed: true,
        notes: 'Confirmed with Sarah via Rover'
      },
      {
        id: 'todo-5',
        title: 'Download offline Google Map areas for Amalfi, Positano, and Rome',
        category: 'bookings',
        dueDateLabel: '2 days before',
        priority: 'medium',
        completed: false,
        notes: 'Save battery and data in mountain roads'
      },
      {
        id: 'todo-6',
        title: 'Buy Type C & L Italy plug adapters',
        category: 'home',
        dueDateLabel: 'Completed',
        priority: 'medium',
        completed: true,
        notes: '2-pack arrived from Amazon'
      },
      {
        id: 'todo-7',
        title: 'Activate Airalo Europe 10GB Regional eSIM',
        category: 'work',
        dueDateLabel: '1 day before departure',
        priority: 'high',
        completed: false,
        notes: 'Install QR code before boarding plane'
      },
      {
        id: 'todo-8',
        title: 'Print physical copies of hotel reservations and emergency numbers',
        category: 'documents',
        dueDateLabel: 'Day of departure',
        priority: 'medium',
        completed: false
      }
    ],
    packingList: [
      { id: 'p-1', name: 'Passports & Flight Boarding Passes', category: 'documents', bagType: 'personal-item', quantity: 2, packed: true, essential: true },
      { id: 'p-2', name: 'Credit Cards (no FTF) & 200 EUR Cash', category: 'documents', bagType: 'personal-item', quantity: 1, packed: true, essential: true },
      { id: 'p-3', name: 'International Driving Permit (IDP)', category: 'documents', bagType: 'personal-item', quantity: 1, packed: false, essential: true },
      { id: 'p-4', name: 'iPhone & USB-C Fast Charger', category: 'electronics', bagType: 'personal-item', quantity: 2, packed: true, essential: true },
      { id: 'p-5', name: 'Anker 10,000mAh Power Bank', category: 'electronics', bagType: 'personal-item', quantity: 1, packed: true, essential: true },
      { id: 'p-6', name: 'Italian Type C/L Plug Adapters', category: 'electronics', bagType: 'carry-on', quantity: 2, packed: true, essential: true },
      { id: 'p-7', name: 'Sony Noise-Canceling Headphones', category: 'electronics', bagType: 'personal-item', quantity: 1, packed: false, essential: false },
      { id: 'p-8', name: 'Linen Shirts & Breezy Tops', category: 'clothing', bagType: 'checked', quantity: 5, packed: false, essential: false },
      { id: 'p-9', name: 'Lightweight Chino Shorts & Trousers', category: 'clothing', bagType: 'checked', quantity: 3, packed: false, essential: false },
      { id: 'p-10', name: 'Swimsuits & Trunks', category: 'clothing', bagType: 'carry-on', quantity: 2, packed: true, essential: true },
      { id: 'p-11', name: 'Comfortable Cobblestone Walking Shoes', category: 'clothing', bagType: 'carry-on', quantity: 1, packed: true, essential: true },
      { id: 'p-12', name: 'Waterproof Boat Shoes / Sandals', category: 'clothing', bagType: 'checked', quantity: 1, packed: false, essential: false },
      { id: 'p-13', name: 'Sunscreen (La Roche-Posay SPF 50+)', category: 'toiletries', bagType: 'carry-on', quantity: 1, packed: true, essential: true },
      { id: 'p-14', name: 'Travel Toothbrush & Marvis Toothpaste', category: 'toiletries', bagType: 'carry-on', quantity: 1, packed: true, essential: true },
      { id: 'p-15', name: 'Hydrating Face Mist & Lip Balm', category: 'toiletries', bagType: 'personal-item', quantity: 1, packed: false, essential: false },
      { id: 'p-16', name: 'Motion Sickness Pills (for Ferries)', category: 'health', bagType: 'personal-item', quantity: 1, packed: true, essential: true },
      { id: 'p-17', name: 'Prescriptions & Ibuprofen', category: 'health', bagType: 'personal-item', quantity: 1, packed: true, essential: true },
      { id: 'p-18', name: 'Polarized Sunglasses', category: 'accessories', bagType: 'personal-item', quantity: 1, packed: true, essential: true },
      { id: 'p-19', name: 'Sun Hat / Woven Straw Fedora', category: 'accessories', bagType: 'carry-on', quantity: 1, packed: false, essential: false },
      { id: 'p-20', name: 'Dry Bag (10L for Capri Boat Tour)', category: 'gear', bagType: 'carry-on', quantity: 1, packed: true, essential: false }
    ],
    expenses: [
      { id: 'exp-1', title: 'Roundtrip Flights (JFK to NAP / FCO to JFK)', category: 'flights-transit', amount: 1150, date: '2026-05-10', notes: 'Economy Plus seats' },
      { id: 'exp-2', title: 'Villa Rosa Deposit (Positano 3 nights)', category: 'lodging', amount: 1140, date: '2026-05-15', notes: 'Balcony sea view' },
      { id: 'exp-3', title: 'Donna Camilla Savelli Rome Hotel (3 nights)', category: 'lodging', amount: 870, date: '2026-05-20', notes: 'Breakfast included' },
      { id: 'exp-4', title: 'Capri Private Gozzo Boat Charter', category: 'activities', amount: 220, date: '2026-06-01', notes: '4-hour private cruise' },
      { id: 'exp-5', title: 'Rome Colosseum VIP Underground Tickets', category: 'activities', amount: 140, date: '2026-06-05', notes: 'Official CoopCulture' },
      { id: 'exp-6', title: 'Trenitalia Frecciarossa High-Speed Rail', category: 'flights-transit', amount: 78, date: '2026-06-12', notes: 'Business class seats' }
    ]
  },
  {
    id: 'trip-japan-2026',
    title: 'Tokyo & Kyoto Autumn Odyssey',
    destination: 'Tokyo & Kyoto, Japan',
    startDate: '2026-10-18',
    endDate: '2026-10-28',
    currency: 'JPY',
    currencySymbol: '¥',
    budgetTotal: 500000,
    coverGradient: 'from-rose-500/20 via-pink-500/10 to-amber-500/20',
    generalNotes: 'Get Welcome Suica or digital Suica in Apple/Google Wallet. Shinkansen tickets can be bound to IC card through SmartEX app. Always keep shoes easy to slip on/off for temples and traditional ryokan.',
    emergencyInfo: {
      embassyPhone: '+81 3-3224-5000 (US Embassy Tokyo)',
      policeLocal: '110 (Police) / 119 (Ambulance & Fire)',
      insurancePolicy: 'WorldNomads #WN-8819034',
      emergencyContactName: 'Hiroshi Tanaka (Ryokan Host)',
      emergencyContactPhone: '+81 75-555-0192'
    },
    itinerary: [
      {
        id: 'jp-day-1',
        dayNumber: 1,
        date: '2026-10-18',
        title: 'Arrival in Tokyo & Shinjuku Neon Night',
        activities: [
          {
            id: 'jp-act-1',
            time: '15:15',
            title: 'Arrive at Haneda Airport (HND)',
            category: 'transport',
            location: 'Haneda Terminal 3',
            notes: 'Pick up Pocket WiFi device at counter 2.',
            bookingRef: 'NH-108',
            cost: 0,
            completed: false
          },
          {
            id: 'jp-act-2',
            time: '17:30',
            title: 'Check-in at Hotel Groove Shinjuku',
            category: 'lodging',
            location: 'Kabukicho Tower, Shinjuku',
            notes: 'High floor view of Mount Fuji on clear mornings.',
            cost: 32000,
            completed: false
          },
          {
            id: 'jp-act-3',
            time: '19:30',
            title: 'Omoide Yokocho Yakitori Alley',
            category: 'dining',
            location: 'Shinjuku West Exit',
            notes: 'Grilled skewers and highballs in historic alleyway.',
            cost: 5000,
            completed: false
          }
        ]
      },
      {
        id: 'jp-day-2',
        dayNumber: 2,
        date: '2026-10-19',
        title: 'Historic Asakusa & Akihabara Electronics',
        activities: [
          {
            id: 'jp-act-4',
            time: '08:30',
            title: 'Senso-ji Temple & Nakamise Dori Street',
            category: 'sightseeing',
            location: 'Asakusa, Taito City',
            notes: 'Visit early to avoid crowds. Draw omikuji fortune.',
            cost: 0,
            completed: false
          },
          {
            id: 'jp-act-5',
            time: '12:30',
            title: 'Tonkatsu Tonki Traditional Cutlet Lunch',
            category: 'dining',
            location: 'Meguro / Asakusa',
            notes: 'Famous pork cutlet with shredded cabbage.',
            cost: 3500,
            completed: false
          }
        ]
      }
    ],
    todos: [
      {
        id: 'jp-todo-1',
        title: 'Fill out Visit Japan Web immigration & customs declaration QR',
        category: 'documents',
        dueDateLabel: '3 days before',
        priority: 'high',
        completed: false,
        notes: 'Fast-track through Haneda customs'
      },
      {
        id: 'jp-todo-2',
        title: 'Book Shibuya Sky sunset time slot (opens 28 days ahead)',
        category: 'bookings',
        dueDateLabel: '4 weeks before',
        priority: 'high',
        completed: false,
        notes: 'Golden hour sells out in minutes'
      },
      {
        id: 'jp-todo-3',
        title: 'Order Ninja WiFi pocket router for Haneda pickup',
        category: 'bookings',
        dueDateLabel: '2 weeks before',
        priority: 'medium',
        completed: false
      }
    ],
    packingList: [
      { id: 'jp-pack-1', name: 'Passport & Rail Pass Confirmation', category: 'documents', bagType: 'personal-item', quantity: 1, packed: false, essential: true },
      { id: 'jp-pack-2', name: 'Slip-on Shoes (easy removal for tatami mats)', category: 'clothing', bagType: 'carry-on', quantity: 1, packed: false, essential: true },
      { id: 'jp-pack-3', name: 'Coin Purse (Japan still uses 100/500 yen coins)', category: 'accessories', bagType: 'personal-item', quantity: 1, packed: false, essential: true }
    ],
    expenses: [
      { id: 'jp-exp-1', title: 'Roundtrip ANA Flights', category: 'flights-transit', amount: 165000, date: '2026-07-01', notes: 'Direct Boeing 787' },
      { id: 'jp-exp-2', title: 'Tokyo Hotel Groove 4 nights', category: 'lodging', amount: 128000, date: '2026-07-10', notes: 'Shinjuku' }
    ]
  }
];
