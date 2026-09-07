import React, { useState, useContext, useMemo, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import Icons from '../components/common/Icons';

const TrackerPage = ({ navigate }) => {
  const { medicines, removeMedicine, todayLog, markDose } = useContext(AppContext);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  const sortedMedicines = useMemo(() => {
    return [...medicines].sort((a, b) => a.time.localeCompare(b.time));
  }, [medicines]);

  const { takenMeds, pendingMeds } = useMemo(() => {
    const taken = [], pending = [];
    sortedMedicines.forEach(med => {
      const status = todayLog[med.id];
      if (status === 'taken') taken.push(med);
      else pending.push({ ...med, isSkipped: status === 'skipped' });
    });
    return { takenMeds: taken, pendingMeds: pending };
  }, [sortedMedicines, todayLog]);

  const handleMarkTaken = useCallback((id) => markDose(id, 'taken'), [markDose]);
  const handleSkip = useCallback((id) => markDose(id, 'skipped'), [markDose]);
  const handleRemove = useCallback((id) => { removeMedicine(id); setConfirmRemoveId(null); }, [removeMedicine]);

  const todayDateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const progressPct = medicines.length === 0 ? 0 : Math.round((takenMeds.length / medicines.length) * 100);

  return (
    <div className="space-y-6 fade-in pb-10">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Tracker</h1>
            <p className="text-gray-500 dark:text-gray-400">{todayDateStr}</p>
          </div>
          <div className="w-full md:w-64">
            <div className="flex justify-between text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
              <span>Adherence</span><span>{progressPct}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div className="bg-teal-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {medicines.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl border border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center text-center text-gray-500 dark:text-gray-400">
          <div className="text-5xl mb-4">💊</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Medicines Tracked</h2>
          <p className="mb-6 max-w-md">You haven't added any medicines to your tracker yet. Search the FDA database to add your prescriptions or supplements.</p>
          <button onClick={() => navigate('search')} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-teal-500/30">
            Search & Add Medicine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span> Pending & Skipped ({pendingMeds.length})
            </h2>
            <div className="space-y-3">
              {pendingMeds.length === 0 ? (
                <div className="p-6 bg-gray-50 dark:bg-slate-900/50 rounded-xl text-center text-gray-500 text-sm border border-gray-100 dark:border-slate-800">All caught up! 🎉</div>
              ) : (
                pendingMeds.map(med => (
                  <div key={med.id} className={`p-4 rounded-xl border transition-all ${med.isSkipped ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50 opacity-75' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg break-words line-clamp-2">{med.name} <span className="text-sm font-normal text-gray-500">{med.dosage}</span></h3>
                        <div className="flex flex-wrap gap-2 mt-1 items-center text-xs font-medium">
                          <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded flex items-center gap-1 whitespace-nowrap">⏰ {med.time}</span>
                          <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded whitespace-nowrap">{med.frequency}</span>
                          {med.isSkipped && <span className="text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded px-2 py-0.5 whitespace-nowrap">Skipped</span>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button onClick={() => handleMarkTaken(med.id)} className="w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:hover:bg-emerald-800 text-emerald-600 flex items-center justify-center transition-colors" title="Mark Taken">✓</button>
                          {!med.isSkipped && <button onClick={() => handleSkip(med.id)} className="w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-800 text-rose-600 flex items-center justify-center transition-colors text-xs font-bold" title="Skip Dose">✕</button>}
                        </div>
                        {confirmRemoveId === med.id ? (
                          <div className="flex gap-1 justify-end fade-in">
                            <button onClick={() => handleRemove(med.id)} className="text-xs bg-rose-500 text-white px-2 py-1 rounded">Sure?</button>
                            <button onClick={() => setConfirmRemoveId(null)} className="text-xs bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-white px-2 py-1 rounded">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmRemoveId(med.id)} className="text-gray-400 hover:text-rose-500 self-end p-1 transition-colors"><Icons.Trash /></button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span> Taken ({takenMeds.length})
            </h2>
            <div className="space-y-3">
              {takenMeds.length === 0 ? (
                <div className="p-6 bg-gray-50 dark:bg-slate-900/50 rounded-xl text-center text-gray-500 text-sm border border-gray-100 dark:border-slate-800">No doses taken yet today.</div>
              ) : (
                takenMeds.map(med => (
                  <div key={med.id} className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 transition-all opacity-80 hover:opacity-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white line-through decoration-emerald-500/50 break-words">{med.name} <span className="text-sm font-normal text-gray-500">{med.dosage}</span></h3>
                        <div className="flex gap-2 mt-1 text-xs">
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">✓ Taken at scheduled time ({med.time})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => markDose(med.id, 'pending')} className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline">Undo</button>
                        {confirmRemoveId === med.id ? (
                          <div className="flex gap-1 justify-end fade-in">
                            <button onClick={() => handleRemove(med.id)} className="text-xs bg-rose-500 text-white px-2 py-1 rounded">Sure?</button>
                            <button onClick={() => setConfirmRemoveId(null)} className="text-xs bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-white px-2 py-1 rounded">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmRemoveId(med.id)} className="text-gray-400 hover:text-rose-500 p-1 transition-colors"><Icons.Trash /></button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerPage;
