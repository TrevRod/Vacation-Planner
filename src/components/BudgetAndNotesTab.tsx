import React, { useState } from 'react';
import { 
  Plus, 
  Wallet, 
  Trash2, 
  Edit2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Check, 
  PieChart,
  ShoppingBag,
  Utensils,
  Plane,
  Bed,
  Compass,
  CreditCard
} from 'lucide-react';
import { Trip, ExpenseItem, ExpenseCategory } from '../types';
import { formatCurrency } from '../utils/storage';

interface BudgetAndNotesTabProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; icon: React.ReactNode; color: string; barColor: string }> = {
  'lodging': { label: 'Hotels & Lodging', icon: <Bed className="w-3.5 h-3.5" />, color: 'text-indigo-700 bg-indigo-50 border-indigo-200', barColor: 'bg-indigo-500' },
  'flights-transit': { label: 'Flights & Transit', icon: <Plane className="w-3.5 h-3.5" />, color: 'text-blue-700 bg-blue-50 border-blue-200', barColor: 'bg-blue-500' },
  'food-dining': { label: 'Food & Dining', icon: <Utensils className="w-3.5 h-3.5" />, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500' },
  'activities': { label: 'Activities & Tours', icon: <Compass className="w-3.5 h-3.5" />, color: 'text-amber-700 bg-amber-50 border-amber-200', barColor: 'bg-amber-500' },
  'shopping': { label: 'Shopping & Souvenirs', icon: <ShoppingBag className="w-3.5 h-3.5" />, color: 'text-rose-700 bg-rose-50 border-rose-200', barColor: 'bg-rose-500' },
  'other': { label: 'Other Expenses', icon: <CreditCard className="w-3.5 h-3.5" />, color: 'text-slate-700 bg-slate-50 border-slate-200', barColor: 'bg-slate-400' }
};

export const BudgetAndNotesTab: React.FC<BudgetAndNotesTabProps> = ({ trip, onUpdateTrip }) => {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('food-dining');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expNotes, setExpNotes] = useState('');

  // General notes
  const [notesDraft, setNotesDraft] = useState(trip.generalNotes || '');
  const [notesSaved, setNotesSaved] = useState(false);

  // Total budget & spent
  const totalSpent = trip.expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = trip.budgetTotal - totalSpent;
  const spentPercent = trip.budgetTotal > 0 ? Math.min(100, Math.round((totalSpent / trip.budgetTotal) * 100)) : 0;

  // Category breakdown calculation
  const categoryTotals = (Object.keys(EXPENSE_CATEGORIES) as ExpenseCategory[]).map((cat) => {
    const sum = trip.expenses
      .filter((e) => e.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const percentOfTotal = totalSpent > 0 ? Math.round((sum / totalSpent) * 100) : 0;
    return {
      category: cat,
      amount: sum,
      percent: percentOfTotal
    };
  });

  const openAddModal = () => {
    setEditingExpense(null);
    setExpTitle('');
    setExpCategory('food-dining');
    setExpAmount('');
    setExpDate(new Date().toISOString().split('T')[0]);
    setExpNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ExpenseItem) => {
    setEditingExpense(item);
    setExpTitle(item.title);
    setExpCategory(item.category);
    setExpAmount(String(item.amount));
    setExpDate(item.date);
    setExpNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;

    const parsedAmount = parseFloat(expAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) return;

    if (editingExpense) {
      const updated = trip.expenses.map((ex) =>
        ex.id === editingExpense.id
          ? {
              ...ex,
              title: expTitle.trim(),
              category: expCategory,
              amount: parsedAmount,
              date: expDate,
              notes: expNotes.trim() || undefined
            }
          : ex
      );
      onUpdateTrip({ ...trip, expenses: updated });
    } else {
      const newExpense: ExpenseItem = {
        id: `exp-${Date.now()}`,
        title: expTitle.trim(),
        category: expCategory,
        amount: parsedAmount,
        date: expDate,
        notes: expNotes.trim() || undefined
      };
      onUpdateTrip({ ...trip, expenses: [newExpense, ...trip.expenses] });
    }

    setIsModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = trip.expenses.filter((e) => e.id !== id);
    onUpdateTrip({ ...trip, expenses: updated });
  };

  const handleSaveNotes = () => {
    onUpdateTrip({ ...trip, generalNotes: notesDraft });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Budget Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Finance & Expenses
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Currency: {trip.currency} ({trip.currencySymbol})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-display">
              Vacation Budget Tracker
            </h2>
          </div>

          <button
            id="budget-add-expense-btn"
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Log Expense
          </button>
        </div>

        {/* 3 Metric Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Planned Budget</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {formatCurrency(trip.budgetTotal, trip.currencySymbol)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Spent</span>
            <p className="text-2xl font-bold text-indigo-900 mt-1">
              {formatCurrency(totalSpent, trip.currencySymbol)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Remaining Balance</span>
            <p className={`text-2xl font-bold mt-1 ${remaining >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {formatCurrency(remaining, trip.currencySymbol)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600">Budget Allocated: {spentPercent}%</span>
            <span className={remaining >= 0 ? 'text-emerald-700' : 'text-rose-600 font-bold'}>
              {remaining >= 0 ? 'Within budget' : 'Over budget'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                remaining >= 0 ? 'bg-indigo-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, spentPercent)}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown Bars */}
        {totalSpent > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Spending Breakdown by Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {categoryTotals.map(({ category, amount, percent }) => {
                const conf = EXPENSE_CATEGORIES[category];
                return (
                  <div key={category} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      {conf.icon}
                      <span className="truncate font-medium">{conf.label}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formatCurrency(amount, trip.currencySymbol)}
                    </p>
                    <span className="text-[11px] text-slate-400 block">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Left Expenses List / Right Trip Notes & Diary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Logged Expenses ({trip.expenses.length})
            </h3>
          </div>

          {trip.expenses.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <Wallet className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No expenses logged yet. Add flights, train tickets, dining, or souvenirs.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {trip.expenses.map((expense) => {
                const conf = EXPENSE_CATEGORIES[expense.category];
                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-white"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900">{expense.title}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${conf.color}`}>
                          {conf.icon}
                          {conf.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {expense.date}
                        </span>
                        {expense.notes && <span>• {expense.notes}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-base font-bold text-slate-900">
                        {formatCurrency(expense.amount, trip.currencySymbol)}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEditModal(expense)}
                        className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                        title="Edit expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Vacation Scratchpad & Notes (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Vacation Notes</h3>
            </div>
            <button
              id="save-trip-notes-btn"
              type="button"
              onClick={handleSaveNotes}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition cursor-pointer"
            >
              {notesSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  Saved!
                </>
              ) : (
                'Save Notes'
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Keep restaurant recommendations, local subway rules, emergency phrasing, or souvenirs to buy.
          </p>

          <textarea
            id="vacation-notes-textarea"
            rows={14}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Write notes here...
- Recommended Gelateria: Frigidarium
- Book trains in advance on Italo / Trenitalia
- Tip driver ~10%
- Must-try dessert: Limoncello Tiramisu"
            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 leading-relaxed font-sans bg-slate-50/50"
          />
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingExpense ? 'Edit Expense' : 'Log Trip Expense'}
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Expense Description *
                </label>
                <input
                  id="expense-title-input"
                  type="text"
                  required
                  placeholder="e.g. Flight tickets, Hotel deposit, Dinner at Trastevere..."
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Amount ({trip.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="lodging">🏨 Hotels & Lodging</option>
                    <option value="flights-transit">✈️ Flights & Transit</option>
                    <option value="food-dining">🍽️ Food & Dining</option>
                    <option value="activities">🎟️ Activities & Tours</option>
                    <option value="shopping">🛍️ Shopping & Souvenirs</option>
                    <option value="other">💼 Other Expenses</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Split with companion, includes tax..."
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
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
                  id="save-expense-submit-btn"
                  type="submit"
                  className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
                >
                  {editingExpense ? 'Save Changes' : 'Log Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
