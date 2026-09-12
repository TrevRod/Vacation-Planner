import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Search, 
  Sparkles, 
  Luggage, 
  Backpack, 
  Briefcase, 
  Star,
  Layers,
  Edit2
} from 'lucide-react';
import { Trip, PackingItem, PackingCategory, BagType } from '../types';
import { ESSENTIAL_PACKING_ITEMS } from '../data/initialData';
import { triggerHaptic } from '../utils/native';

interface PackingListTabProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

const CATEGORY_CONFIG: Record<PackingCategory, { label: string; icon: string }> = {
  clothing: { label: 'Clothing & Footwear', icon: '👕' },
  toiletries: { label: 'Toiletries & Grooming', icon: '🧴' },
  electronics: { label: 'Electronics & Cables', icon: '🔌' },
  documents: { label: 'Travel Documents & Money', icon: '🛂' },
  health: { label: 'Health & First Aid', icon: '💊' },
  gear: { label: 'Gear & Beach Equipment', icon: '🎒' },
  accessories: { label: 'Accessories & Eyewear', icon: '🕶️' }
};

const BAG_CONFIG: Record<BagType, { label: string; icon: React.ReactNode; color: string }> = {
  'carry-on': { label: 'Carry-On', icon: <Luggage className="w-3.5 h-3.5" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  'checked': { label: 'Checked Bag', icon: <Briefcase className="w-3.5 h-3.5" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  'personal-item': { label: 'Personal Item / Daypack', icon: <Backpack className="w-3.5 h-3.5" />, color: 'bg-amber-50 text-amber-700 border-amber-200' }
};

export const PackingListTab: React.FC<PackingListTabProps> = ({ trip, onUpdateTrip }) => {
  const [filterBag, setFilterBag] = useState<BagType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unpacked' | 'packed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'category' | 'bag'>('category');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);

  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<PackingCategory>('clothing');
  const [itemBag, setItemBag] = useState<BagType>('carry-on');
  const [itemQty, setItemQty] = useState(1);
  const [itemEssential, setItemEssential] = useState(false);

  const totalItems = trip.packingList.length;
  const packedItems = trip.packingList.filter((p) => p.packed).length;
  const packingPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  // Luggage counts
  const carryOnCount = trip.packingList.filter((p) => p.bagType === 'carry-on').length;
  const carryOnPacked = trip.packingList.filter((p) => p.bagType === 'carry-on' && p.packed).length;

  const checkedCount = trip.packingList.filter((p) => p.bagType === 'checked').length;
  const checkedPacked = trip.packingList.filter((p) => p.bagType === 'checked' && p.packed).length;

  const personalCount = trip.packingList.filter((p) => p.bagType === 'personal-item').length;
  const personalPacked = trip.packingList.filter((p) => p.bagType === 'personal-item' && p.packed).length;

  const handleTogglePacked = (id: string) => {
    triggerHaptic('light');
    const updated = trip.packingList.map((p) =>
      p.id === id ? { ...p, packed: !p.packed } : p
    );
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const updated = trip.packingList.map((p) => {
      if (p.id === id) {
        const newQty = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQty };
      }
      return p;
    });
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const handleDeleteItem = (id: string) => {
    const updated = trip.packingList.filter((p) => p.id !== id);
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const openAddItemModal = () => {
    setEditingItem(null);
    setItemName('');
    setItemCategory('clothing');
    setItemBag('carry-on');
    setItemQty(1);
    setItemEssential(false);
    setIsModalOpen(true);
  };

  const openEditItemModal = (item: PackingItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemBag(item.bagType);
    setItemQty(item.quantity);
    setItemEssential(item.essential || false);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    if (editingItem) {
      const updated = trip.packingList.map((p) =>
        p.id === editingItem.id
          ? {
              ...p,
              name: itemName.trim(),
              category: itemCategory,
              bagType: itemBag,
              quantity: itemQty,
              essential: itemEssential
            }
          : p
      );
      onUpdateTrip({ ...trip, packingList: updated });
    } else {
      const newItem: PackingItem = {
        id: `pack-${Date.now()}`,
        name: itemName.trim(),
        category: itemCategory,
        bagType: itemBag,
        quantity: itemQty,
        packed: false,
        essential: itemEssential
      };
      onUpdateTrip({ ...trip, packingList: [...trip.packingList, newItem] });
    }

    setIsModalOpen(false);
  };

  const handleImportEssentials = () => {
    const existingNames = new Set(trip.packingList.map((p) => p.name.toLowerCase()));
    const toAdd: PackingItem[] = [];

    ESSENTIAL_PACKING_ITEMS.forEach((item, index) => {
      if (!existingNames.has(item.name.toLowerCase())) {
        toAdd.push({
          ...item,
          id: `pack-imported-${Date.now()}-${index}`
        });
      }
    });

    if (toAdd.length === 0) {
      alert('All essential packing items are already on your list!');
      return;
    }

    onUpdateTrip({ ...trip, packingList: [...trip.packingList, toAdd] as any });
  };

  const handleSetAllPacked = (packed: boolean) => {
    const updated = trip.packingList.map((p) => ({ ...p, packed }));
    onUpdateTrip({ ...trip, packingList: updated });
  };

  // Filter items
  const filteredItems = trip.packingList.filter((item) => {
    if (filterBag !== 'all' && item.bagType !== filterBag) return false;
    if (filterStatus === 'unpacked' && item.packed) return false;
    if (filterStatus === 'packed' && !item.packed) return false;
    if (searchQuery.trim()) {
      if (!item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Luggage Stats Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                Luggage & Packing
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {packedItems} of {totalItems} items packed
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-display">
              Vacation Packing List
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="import-packing-essentials-btn"
              type="button"
              onClick={handleImportEssentials}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Add Travel Essentials
            </button>
            <button
              id="packing-add-item-btn"
              type="button"
              onClick={openAddItemModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600">Total Packed Progress</span>
            <span className="text-slate-900 font-bold">{packingPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${packingPercent}%` }}
            />
          </div>
        </div>

        {/* 3 Luggage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div 
            onClick={() => setFilterBag(filterBag === 'carry-on' ? 'all' : 'carry-on')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              filterBag === 'carry-on' ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-blue-700 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Luggage className="w-4 h-4" />
                Carry-On
              </span>
              <span>{carryOnPacked} / {carryOnCount}</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-1 mt-2">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all" 
                style={{ width: carryOnCount > 0 ? `${(carryOnPacked / carryOnCount) * 100}%` : '0%' }}
              />
            </div>
          </div>

          <div 
            onClick={() => setFilterBag(filterBag === 'checked' ? 'all' : 'checked')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              filterBag === 'checked' ? 'border-purple-400 bg-purple-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-purple-700 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                Checked Bag
              </span>
              <span>{checkedPacked} / {checkedCount}</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-1 mt-2">
              <div 
                className="bg-purple-600 h-1 rounded-full transition-all" 
                style={{ width: checkedCount > 0 ? `${(checkedPacked / checkedCount) * 100}%` : '0%' }}
              />
            </div>
          </div>

          <div 
            onClick={() => setFilterBag(filterBag === 'personal-item' ? 'all' : 'personal-item')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              filterBag === 'personal-item' ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-amber-700 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Backpack className="w-4 h-4" />
                Personal Item
              </span>
              <span>{personalPacked} / {personalCount}</span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-1 mt-2">
              <div 
                className="bg-amber-600 h-1 rounded-full transition-all" 
                style={{ width: personalCount > 0 ? `${(personalPacked / personalCount) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Options */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({totalItems})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('unpacked')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === 'unpacked' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unpacked ({totalItems - packedItems})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('packed')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === 'packed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Packed ({packedItems})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Group By toggle */}
            <div className="flex items-center gap-1 text-xs border border-slate-200 rounded-xl p-1">
              <span className="text-slate-400 pl-1.5 flex items-center gap-1">
                <Layers className="w-3 h-3" />
              </span>
              <button
                type="button"
                onClick={() => setGroupBy('category')}
                className={`px-2 py-1 rounded-lg font-medium cursor-pointer ${
                  groupBy === 'category' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Category
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('bag')}
                className={`px-2 py-1 rounded-lg font-medium cursor-pointer ${
                  groupBy === 'bag' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Bag Type
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Bag filter reset tag if active */}
        {filterBag !== 'all' && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500">Filtered by bag:</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 flex items-center gap-1">
              {BAG_CONFIG[filterBag].label}
              <button 
                type="button" 
                onClick={() => setFilterBag('all')}
                className="hover:text-amber-950 font-bold ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Packing Items List (Grouped) */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <Luggage className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No packing items found</p>
          <p className="text-xs text-slate-500 mt-1">
            Add clothing, toiletries, adapters, or import standard travel essentials!
          </p>
          <button
            type="button"
            onClick={handleImportEssentials}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Add Essential Travel Packing Items
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Render Groups */}
          {(groupBy === 'category'
            ? (Object.keys(CATEGORY_CONFIG) as PackingCategory[])
            : (Object.keys(BAG_CONFIG) as BagType[])
          ).map((groupKey) => {
            const itemsInGroup = filteredItems.filter((i) =>
              groupBy === 'category' ? i.category === groupKey : i.bagType === groupKey
            );

            if (itemsInGroup.length === 0) return null;

            const groupTitle =
              groupBy === 'category'
                ? `${CATEGORY_CONFIG[groupKey as PackingCategory].icon} ${CATEGORY_CONFIG[groupKey as PackingCategory].label}`
                : `${BAG_CONFIG[groupKey as BagType].label}`;

            const groupPacked = itemsInGroup.filter((i) => i.packed).length;

            return (
              <div key={groupKey} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{groupTitle}</span>
                    <span className="text-xs font-normal text-slate-500">
                      ({groupPacked}/{itemsInGroup.length} packed)
                    </span>
                  </h3>
                </div>

                <div className="space-y-2">
                  {itemsInGroup.map((item) => {
                    const bag = BAG_CONFIG[item.bagType];
                    return (
                      <div
                        key={item.id}
                        id={`packing-item-${item.id}`}
                        className={`flex items-center justify-between p-3 rounded-xl border transition ${
                          item.packed
                            ? 'bg-slate-50/70 border-slate-200 opacity-70'
                            : 'bg-white border-slate-100 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePacked(item.id)}
                            title={item.packed ? 'Mark unpacked' : 'Mark packed'}
                            className="text-slate-300 hover:text-emerald-600 transition cursor-pointer shrink-0"
                          >
                            {item.packed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-600" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                onClick={() => handleTogglePacked(item.id)}
                                className={`text-sm font-medium cursor-pointer ${
                                  item.packed ? 'line-through text-slate-400' : 'text-slate-900'
                                }`}
                              >
                                {item.name}
                              </span>
                              {item.essential && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                  Essential
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${bag.color}`}>
                                {bag.icon}
                                {bag.label}
                              </span>
                              {groupBy !== 'category' && (
                                <span className="text-[11px] text-slate-500">
                                  {CATEGORY_CONFIG[item.category].icon} {CATEGORY_CONFIG[item.category].label}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Quantity control */}
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="px-2 py-1 hover:bg-slate-200 rounded-l-lg text-slate-600 cursor-pointer font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 font-semibold text-slate-800 min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="px-2 py-1 hover:bg-slate-200 rounded-r-lg text-slate-600 cursor-pointer font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => openEditItemModal(item)}
                            title="Edit item"
                            className="p-1.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            title="Delete item"
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Batch Actions */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
          <span>{totalItems - packedItems} items left to pack</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSetAllPacked(true)}
              className="hover:text-emerald-700 transition cursor-pointer font-medium"
            >
              Mark all packed
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleSetAllPacked(false)}
              className="hover:text-amber-700 transition cursor-pointer font-medium"
            >
              Unpack all
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Packing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingItem ? 'Edit Packing Item' : 'Add Item to Pack'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Item Name *
                </label>
                <input
                  id="pack-modal-item-name"
                  type="text"
                  required
                  placeholder="e.g. Linen shirts, Sunscreen SPF 50, Camera lens..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as PackingCategory)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="clothing">👕 Clothing & Footwear</option>
                    <option value="toiletries">🧴 Toiletries & Grooming</option>
                    <option value="electronics">🔌 Electronics & Cables</option>
                    <option value="documents">🛂 Travel Documents & Cash</option>
                    <option value="health">💊 Health & First Aid</option>
                    <option value="gear">🎒 Gear & Beach Equipment</option>
                    <option value="accessories">🕶️ Accessories & Eyewear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Bag Assignment
                  </label>
                  <select
                    value={itemBag}
                    onChange={(e) => setItemBag(e.target.value as BagType)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="carry-on">🧳 Carry-On</option>
                    <option value="checked">💼 Checked Bag</option>
                    <option value="personal-item">🎒 Personal Item / Daypack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={itemQty}
                    onChange={(e) => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemEssential}
                      onChange={(e) => setItemEssential(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                    />
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Must-have essential
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-packing-submit-btn"
                  type="submit"
                  className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
