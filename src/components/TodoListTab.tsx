import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Search, 
  Sparkles, 
  AlertCircle, 
  Calendar,
  FileCheck,
  CheckCheck
} from 'lucide-react';
import { Trip, TodoItem, TodoCategory, PriorityLevel } from '../types';
import { ESSENTIAL_TODO_ITEMS } from '../data/initialData';
import { triggerHaptic } from '../utils/native';

interface TodoListTabProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

const CATEGORY_LABELS: Record<TodoCategory, { label: string; icon: string; color: string }> = {
  documents: { label: 'Documents & Passports', icon: '🛂', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  bookings: { label: 'Bookings & Tickets', icon: '🎟️', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  home: { label: 'Home & Pets', icon: '🏡', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  finance: { label: 'Finance & Banking', icon: '💳', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  health: { label: 'Health & Pharmacy', icon: '💊', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  work: { label: 'Tech & Connectivity', icon: '📶', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' }
};

export const TodoListTab: React.FC<TodoListTabProps> = ({ trip, onUpdateTrip }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterCategory, setFilterCategory] = useState<TodoCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  const [todoTitle, setTodoTitle] = useState('');
  const [todoCategory, setTodoCategory] = useState<TodoCategory>('documents');
  const [todoDueDate, setTodoDueDate] = useState('');
  const [todoPriority, setTodoPriority] = useState<PriorityLevel>('high');
  const [todoNotes, setTodoNotes] = useState('');

  const totalTasks = trip.todos.length;
  const completedTasks = trip.todos.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggle = (id: string) => {
    triggerHaptic('success');
    const updated = trip.todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    onUpdateTrip({ ...trip, todos: updated });
  };

  const handleDelete = (id: string) => {
    const updated = trip.todos.filter((t) => t.id !== id);
    onUpdateTrip({ ...trip, todos: updated });
  };

  const openAddModal = () => {
    setEditingTodo(null);
    setTodoTitle('');
    setTodoCategory('documents');
    setTodoDueDate('1 week before');
    setTodoPriority('medium');
    setTodoNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (todo: TodoItem) => {
    setEditingTodo(todo);
    setTodoTitle(todo.title);
    setTodoCategory(todo.category);
    setTodoDueDate(todo.dueDateLabel || '');
    setTodoPriority(todo.priority);
    setTodoNotes(todo.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoTitle.trim()) return;

    if (editingTodo) {
      const updated = trip.todos.map((t) =>
        t.id === editingTodo.id
          ? {
              ...t,
              title: todoTitle.trim(),
              category: todoCategory,
              dueDateLabel: todoDueDate.trim() || undefined,
              priority: todoPriority,
              notes: todoNotes.trim() || undefined
            }
          : t
      );
      onUpdateTrip({ ...trip, todos: updated });
    } else {
      const newTodo: TodoItem = {
        id: `todo-${Date.now()}`,
        title: todoTitle.trim(),
        category: todoCategory,
        dueDateLabel: todoDueDate.trim() || undefined,
        priority: todoPriority,
        completed: false,
        notes: todoNotes.trim() || undefined
      };
      onUpdateTrip({ ...trip, todos: [newTodo, ...trip.todos] });
    }

    setIsModalOpen(false);
  };

  const handleImportEssentials = () => {
    // Add essential items that aren't already in the list
    const existingTitles = new Set(trip.todos.map((t) => t.title.toLowerCase()));
    const toAdd: TodoItem[] = [];

    ESSENTIAL_TODO_ITEMS.forEach((item, index) => {
      if (!existingTitles.has(item.title.toLowerCase())) {
        toAdd.push({
          ...item,
          id: `todo-imported-${Date.now()}-${index}`
        });
      }
    });

    if (toAdd.length === 0) {
      alert('All essential pre-trip tasks are already in your checklist!');
      return;
    }

    onUpdateTrip({ ...trip, todos: [...trip.todos, ...toAdd] });
  };

  const handleMarkAllCompleted = (completed: boolean) => {
    const updated = trip.todos.map((t) => ({ ...t, completed }));
    onUpdateTrip({ ...trip, todos: updated });
  };

  // Filter items
  const filteredTodos = trip.todos.filter((t) => {
    if (filterStatus === 'active' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchNotes = (t.notes || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Progress & Quick Actions Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                Pre-Trip Preparation
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {completedTasks} of {totalTasks} tasks done
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-display">
              Vacation To-Do Checklist
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="import-essential-todos-btn"
              type="button"
              onClick={handleImportEssentials}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Add Travel Essentials
            </button>
            <button
              id="todo-add-task-btn"
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600">Checklist Completion</span>
            <span className="text-slate-900 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalTasks})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === 'active'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({totalTasks - completedTasks})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === 'completed'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({completedTasks})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search to-dos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {(Object.keys(CATEGORY_LABELS) as TodoCategory[]).map((cat) => {
            const isSelected = filterCategory === cat;
            const count = trip.todos.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{CATEGORY_LABELS[cat].icon}</span>
                <span>{CATEGORY_LABELS[cat].label}</span>
                {count > 0 && <span className="opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTodos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No tasks found matching your filters</p>
            <p className="text-xs text-slate-500 mt-1">
              {totalTasks === 0 ? 'Start by adding a task or importing essential travel prep to-dos!' : 'Try clearing your search or status filters.'}
            </p>
            {totalTasks === 0 && (
              <button
                type="button"
                onClick={handleImportEssentials}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Add Essential Pre-Trip Tasks
              </button>
            )}
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const cat = CATEGORY_LABELS[todo.category];
            return (
              <div
                key={todo.id}
                id={`todo-item-${todo.id}`}
                className={`flex items-start gap-3 p-4 rounded-2xl border transition ${
                  todo.completed
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
                }`}
              >
                {/* Custom Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggle(todo.id)}
                  title={todo.completed ? 'Mark pending' : 'Mark completed'}
                  className="mt-0.5 text-slate-300 hover:text-amber-600 transition cursor-pointer shrink-0"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 hover:text-amber-600" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        onClick={() => handleToggle(todo.id)}
                        className={`text-sm font-semibold text-slate-900 cursor-pointer ${
                          todo.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {todo.title}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${cat.color}`}>
                          {cat.icon} {cat.label}
                        </span>

                        {todo.dueDateLabel && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {todo.dueDateLabel}
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            todo.priority === 'high'
                              ? 'bg-rose-50 text-rose-700'
                              : todo.priority === 'medium'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {todo.priority}
                        </span>
                      </div>

                      {todo.notes && (
                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {todo.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(todo)}
                        title="Edit task"
                        className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(todo.id)}
                        title="Delete task"
                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick completion toolbar at bottom */}
      {totalTasks > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
          <span>{totalTasks - completedTasks} active tasks left</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleMarkAllCompleted(true)}
              className="hover:text-emerald-700 transition cursor-pointer font-medium"
            >
              Mark all done
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleMarkAllCompleted(false)}
              className="hover:text-amber-700 transition cursor-pointer font-medium"
            >
              Reset all to pending
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingTodo ? 'Edit To-Do Task' : 'Add Pre-Trip Task'}
            </h3>

            <form onSubmit={handleSaveTodo} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Task Title *
                </label>
                <input
                  id="todo-modal-title-input"
                  type="text"
                  required
                  placeholder="e.g. Notify credit card bank, Buy travel adapters..."
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={todoCategory}
                    onChange={(e) => setTodoCategory(e.target.value as TodoCategory)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="documents">🛂 Documents & Passports</option>
                    <option value="bookings">🎟️ Bookings & Tickets</option>
                    <option value="home">🏡 Home & Pets</option>
                    <option value="finance">💳 Finance & Banking</option>
                    <option value="health">💊 Health & Pharmacy</option>
                    <option value="work">📶 Tech & Connectivity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Priority
                  </label>
                  <select
                    value={todoPriority}
                    onChange={(e) => setTodoPriority(e.target.value as PriorityLevel)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="high">🔴 High Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="low">⚪ Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Due Date Label */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Due Timing
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 weeks before, 3 days before, Day before departure..."
                  value={todoDueDate}
                  onChange={(e) => setTodoDueDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Notes & Check details
                </label>
                <textarea
                  rows={2}
                  placeholder="Account numbers, key details, reminder notes..."
                  value={todoNotes}
                  onChange={(e) => setTodoNotes(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-todo-submit-btn"
                  type="submit"
                  className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
                >
                  {editingTodo ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
