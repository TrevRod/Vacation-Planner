import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, DollarSign, ShieldAlert, Sparkles, Wand2 } from 'lucide-react';
import { Trip, EmergencyInfo } from '../types';
import { ESSENTIAL_PACKING_ITEMS, ESSENTIAL_TODO_ITEMS } from '../data/initialData';
import { TRIP_PRESETS, TripPreset } from '../data/tripPresets';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trip: Trip) => void;
  initialTrip?: Trip | null; // if provided, edit mode; otherwise, create mode
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso (Mex$)' }
];

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTrip
}) => {
  const isEdit = Boolean(initialTrip);

  const [selectedPreset, setSelectedPreset] = useState<TripPreset | null>(null);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [budgetTotal, setBudgetTotal] = useState('2500');
  
  // Emergency info
  const [policeLocal, setPoliceLocal] = useState('911');
  const [embassyPhone, setEmbassyPhone] = useState('');
  const [insurancePolicy, setInsurancePolicy] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // New trip options
  const [seedEssentials, setSeedEssentials] = useState(true);

  useEffect(() => {
    if (initialTrip) {
      setSelectedPreset(null);
      setTitle(initialTrip.title);
      setDestination(initialTrip.destination);
      setStartDate(initialTrip.startDate);
      setEndDate(initialTrip.endDate);
      setCurrencyCode(initialTrip.currency);
      setBudgetTotal(String(initialTrip.budgetTotal));
      setPoliceLocal(initialTrip.emergencyInfo.policeLocal || '');
      setEmbassyPhone(initialTrip.emergencyInfo.embassyPhone || '');
      setInsurancePolicy(initialTrip.emergencyInfo.insurancePolicy || '');
      setContactName(initialTrip.emergencyInfo.emergencyContactName || '');
      setContactPhone(initialTrip.emergencyInfo.emergencyContactPhone || '');
    } else {
      // Defaults for new trip
      const now = new Date();
      const inOneMonth = new Date();
      inOneMonth.setDate(now.getDate() + 30);
      const inOneMonthPlusWeek = new Date();
      inOneMonthPlusWeek.setDate(inOneMonth.getDate() + 7);

      setSelectedPreset(null);
      setTitle('');
      setDestination('');
      setStartDate(inOneMonth.toISOString().split('T')[0]);
      setEndDate(inOneMonthPlusWeek.toISOString().split('T')[0]);
      setCurrencyCode('USD');
      setBudgetTotal('3000');
      setPoliceLocal('112');
      setEmbassyPhone('');
      setInsurancePolicy('');
      setContactName('');
      setContactPhone('');
      setSeedEssentials(true);
    }
  }, [initialTrip, isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: TripPreset) => {
    setSelectedPreset(preset);
    setTitle(preset.name);
    setDestination(preset.destination);
    setCurrencyCode(preset.currency);
    setBudgetTotal(String(preset.budgetTotal));
    setPoliceLocal(preset.emergencyInfo.policeLocal);
    setEmbassyPhone(preset.emergencyInfo.embassyPhone);
    if (preset.emergencyInfo.insurancePolicy) {
      setInsurancePolicy(preset.emergencyInfo.insurancePolicy);
    }

    // Set end date according to preset duration
    if (startDate) {
      const s = new Date(startDate + 'T00:00:00');
      const e = new Date(s);
      e.setDate(s.getDate() + preset.defaultDurationDays);
      setEndDate(e.toISOString().split('T')[0]);
    }
  };

  const handleClearPreset = () => {
    setSelectedPreset(null);
    setTitle('');
    setDestination('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim() || !startDate || !endDate) return;

    const curr = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
    const budgetNum = parseFloat(budgetTotal) || 0;

    const emergencyInfo: EmergencyInfo = {
      policeLocal: policeLocal.trim() || undefined,
      embassyPhone: embassyPhone.trim() || undefined,
      insurancePolicy: insurancePolicy.trim() || undefined,
      emergencyContactName: contactName.trim() || undefined,
      emergencyContactPhone: contactPhone.trim() || undefined
    };

    if (isEdit && initialTrip) {
      const updated: Trip = {
        ...initialTrip,
        title: title.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        currency: curr.code,
        currencySymbol: curr.symbol,
        budgetTotal: budgetNum,
        emergencyInfo
      };
      onSave(updated);
    } else {
      // Generating day 1 to day N for the new trip
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');
      const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

      const generatedDays = Array.from({ length: Math.min(diffDays, 30) }, (_, idx) => {
        const d = new Date(start);
        d.setDate(start.getDate() + idx);
        const dayStr = d.toISOString().split('T')[0];

        // If a preset is chosen and has sample days for this index
        const presetDay = selectedPreset?.sampleDays?.[idx];

        return {
          id: `day-${Date.now()}-${idx + 1}`,
          dayNumber: idx + 1,
          date: dayStr,
          title: presetDay ? presetDay.title : idx === 0 ? 'Arrival & Check-in' : `Day ${idx + 1} Activities`,
          activities: presetDay
            ? presetDay.activities.map((act, aIdx) => ({
                id: `act-${Date.now()}-${idx + 1}-${aIdx + 1}`,
                time: act.time,
                title: act.title,
                category: act.category,
                location: act.location,
                notes: act.notes,
                cost: act.cost || 0,
                completed: false
              }))
            : []
        };
      });

      // Prepare todos
      const baseTodos = seedEssentials
        ? ESSENTIAL_TODO_ITEMS.map((item, idx) => ({ ...item, id: `todo-new-${Date.now()}-${idx}` }))
        : [];
      const presetTodos = selectedPreset?.customTodos
        ? selectedPreset.customTodos.map((t, idx) => ({ ...t, id: `todo-preset-${Date.now()}-${idx}`, completed: false }))
        : [];

      // Prepare packing
      const basePacking = seedEssentials
        ? ESSENTIAL_PACKING_ITEMS.map((item, idx) => ({ ...item, id: `pack-new-${Date.now()}-${idx}` }))
        : [];
      const presetPacking = selectedPreset?.customPacking
        ? selectedPreset.customPacking.map((p, idx) => ({ ...p, id: `pack-preset-${Date.now()}-${idx}`, packed: false }))
        : [];

      const newTrip: Trip = {
        id: `trip-${Date.now()}`,
        title: title.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        currency: curr.code,
        currencySymbol: curr.symbol,
        budgetTotal: budgetNum,
        coverGradient: selectedPreset?.coverGradient || 'from-amber-500/20 via-orange-500/10 to-sky-500/20',
        generalNotes: selectedPreset
          ? `Notes for ${selectedPreset.name}:\n- Key reservations and places to visit\n- Emergency: ${selectedPreset.emergencyInfo.policeLocal}`
          : 'Flight confirmations, hotel reservation codes, key sights, and emergency contacts.',
        emergencyInfo,
        itinerary: generatedDays,
        todos: [...presetTodos, ...baseTodos],
        packingList: [...presetPacking, ...basePacking],
        expenses: []
      };

      onSave(newTrip);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {isEdit ? 'Edit Vacation Details' : 'Plan a New Vacation'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? 'Update dates, budget, or destination' : 'Add another vacation plan to your travel collection'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Starter Options (only on Create mode) */}
        {!isEdit && (
          <div className="mb-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                Quick Starter Presets
              </span>
              {selectedPreset && (
                <button
                  type="button"
                  onClick={handleClearPreset}
                  className="text-[11px] text-amber-700 hover:underline font-semibold cursor-pointer"
                >
                  Clear & build custom
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TRIP_PRESETS.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2 rounded-lg text-left transition cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-100/70 border-amber-400 ring-1 ring-amber-400 text-amber-950 font-semibold'
                        : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-700'
                    }`}
                  >
                    <div className="text-base">{preset.iconText}</div>
                    <div className="text-[11px] font-bold truncate mt-0.5">{preset.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 truncate">{preset.destination.split(',')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Destination */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Vacation Title *
            </label>
            <input
              id="trip-modal-title"
              type="text"
              required
              placeholder="e.g. Summer in Amalfi Coast & Rome, Hawaiian Getaway..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Destination & Region *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="trip-modal-destination"
                type="text"
                required
                placeholder="e.g. Positano & Rome, Italy"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Start Date *
              </label>
              <input
                id="trip-modal-start-date"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                End Date *
              </label>
              <input
                id="trip-modal-end-date"
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Currency & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Currency
              </label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Total Planned Budget
              </label>
              <input
                type="number"
                min="0"
                value={budgetTotal}
                onChange={(e) => setBudgetTotal(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Emergency Info Collapsible Header */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Emergency & Support Contacts (Optional)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Local Police / Emergency Number</label>
                <input
                  type="text"
                  placeholder="e.g. 112 (EU) or 911"
                  value={policeLocal}
                  onChange={(e) => setPoliceLocal(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Embassy / Consulate Phone</label>
                <input
                  type="text"
                  placeholder="+39 06 46741"
                  value={embassyPhone}
                  onChange={(e) => setEmbassyPhone(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Travel Insurance Policy #</label>
                <input
                  type="text"
                  placeholder="Policy / Member ID"
                  value={insurancePolicy}
                  onChange={(e) => setInsurancePolicy(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Emergency Contact Phone</label>
                <input
                  type="text"
                  placeholder="Family or Doctor Phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Seed Template Checkbox (only on Create) */}
          {!isEdit && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seedEssentials}
                  onChange={(e) => setSeedEssentials(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Pre-populate with Essential Travel Templates
                  </span>
                  <p className="text-[11px] text-amber-800/80 mt-0.5">
                    Automatically seeds common pre-trip to-dos (passport checks, pet care, bank notice) and essential packing items (cables, adapters, sunscreen, toiletries).
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Submit buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="trip-modal-save-btn"
              type="submit"
              className="px-5 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
            >
              {isEdit ? 'Save Changes' : 'Create Vacation Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

