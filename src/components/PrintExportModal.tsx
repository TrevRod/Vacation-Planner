import React, { useState } from 'react';
import { X, Copy, Check, Printer, Download, Upload, FileText } from 'lucide-react';
import { Trip } from '../types';
import { formatCurrency, formatTripDates } from '../utils/storage';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip?: Trip | null;
  onImportTrip: (importedTrip: Trip) => void;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  trip,
  onImportTrip
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');

  if (!isOpen) return null;

  // Generate plain text summary for companion sharing / WhatsApp
  const generateTextSummary = (): string => {
    if (!trip) return 'No vacation data to export.';
    const dates = formatTripDates(trip.startDate, trip.endDate);
    let out = `✈️ VACATION PLAN: ${trip.title.toUpperCase()}\n`;
    out += `📍 Destination: ${trip.destination}\n`;
    out += `📅 Dates: ${dates}\n`;
    out += `💰 Budget: ${formatCurrency(trip.budgetTotal, trip.currencySymbol)}\n\n`;

    out += `📋 DAY-BY-DAY ITINERARY:\n`;
    trip.itinerary.forEach((day) => {
      out += `\nDay ${day.dayNumber}: ${day.title} (${day.date})\n`;
      if (day.activities.length === 0) {
        out += `  - No events scheduled yet\n`;
      } else {
        day.activities.forEach((act) => {
          out += `  • [${act.time}] ${act.title}`;
          if (act.location) out += ` (${act.location})`;
          if (act.bookingRef) out += ` [Ref: ${act.bookingRef}]`;
          out += `\n`;
        });
      }
    });

    out += `\n☑️ PRE-TRIP TO-DO LIST:\n`;
    const pending = trip.todos.filter((t) => !t.completed);
    if (pending.length === 0) {
      out += `  All pre-trip tasks completed!\n`;
    } else {
      pending.forEach((t) => {
        out += `  [ ] ${t.title}${t.dueDateLabel ? ` (Due: ${t.dueDateLabel})` : ''}\n`;
      });
    }

    out += `\n🧳 PACKING ESSENTIALS CHECKLIST:\n`;
    trip.packingList
      .filter((p) => !p.packed)
      .slice(0, 15)
      .forEach((p) => {
        out += `  [ ] ${p.name} (Qty: ${p.quantity}, ${p.bagType})\n`;
      });

    if (trip.emergencyInfo.policeLocal || trip.emergencyInfo.embassyPhone) {
      out += `\n🆘 EMERGENCY CONTACTS:\n`;
      if (trip.emergencyInfo.policeLocal) out += `  Local Police: ${trip.emergencyInfo.policeLocal}\n`;
      if (trip.emergencyInfo.embassyPhone) out += `  Embassy: ${trip.emergencyInfo.embassyPhone}\n`;
      if (trip.emergencyInfo.insurancePolicy) out += `  Insurance Policy: ${trip.emergencyInfo.insurancePolicy}\n`;
    }

    return out;
  };

  const textSummary = generateTextSummary();

  const handleCopyText = () => {
    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    if (!trip) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${trip.title.replace(/\s+/g, '_')}_vacation_plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.title && Array.isArray(parsed.itinerary)) {
          // Generate new ID if needed
          parsed.id = `trip-imported-${Date.now()}`;
          onImportTrip(parsed);
          alert(`Successfully imported vacation: "${parsed.title}"!`);
          onClose();
        } else {
          alert('Invalid trip JSON format.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Export & Share Vacation Plan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy a formatted itinerary for group chat, print to PDF, or backup your vacation data.
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

        {/* View Options */}
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'text' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Travel Summary Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'json' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Backup & JSON Data
          </button>
        </div>

        {activeTab === 'text' ? (
          <div>
            <div className="relative mb-4">
              <pre className="text-xs p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 max-h-80 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                {textSummary}
              </pre>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                Print / Save PDF
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  id="copy-text-summary-btn"
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Travel Summary
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-amber-600" />
                  Download Backup File (.json)
                </h4>
                <p className="text-slate-500">
                  Export all itineraries, to-do lists, packing items, and expense records into a reusable JSON file.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export {trip.title}.json
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  Import Vacation File (.json)
                </h4>
                <p className="text-slate-500">
                  Restore a previously exported vacation plan or load a vacation shared by a companion.
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="mt-2 text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
