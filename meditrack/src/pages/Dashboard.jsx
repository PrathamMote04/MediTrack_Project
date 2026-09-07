import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import Icons from '../components/common/Icons';
import { fetchQuote, fetchHealthStats } from '../services/api';
import { getTodayString } from '../utils/helpers';

const DashboardPage = ({ navigate }) => {
  const { medicines, historyLog, searchHistory } = useContext(AppContext);

  const [quote, setQuote] = useState({ content: '', author: '' });
  const [healthStats, setHealthStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [qData, hData] = await Promise.all([fetchQuote(), fetchHealthStats()]);
        if (isMounted) { setQuote(qData); setHealthStats(hData); }
      } catch (err) {
        console.error("Dashboard data load failed", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  const todayStats = useMemo(() => {
    const todayStr = getTodayString();
    const tLog = historyLog[todayStr] || {};
    let taken = 0, skipped = 0, pending = 0;

    medicines.forEach(med => {
      if (tLog[med.id] === 'taken') taken++;
      else if (tLog[med.id] === 'skipped') skipped++;
      else pending++;
    });

    const total = medicines.length;
    const percentage = total === 0 ? 0 : Math.round((taken / total) * 100);
    return { taken, skipped, pending, total, percentage };
  }, [medicines, historyLog]);

  const weeklyAdherence = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const logForDay = historyLog[dateStr] || {};
      let takenCount = 0;
      Object.values(logForDay).forEach(status => { if (status === 'taken') takenCount++; });

      const pct = medicines.length === 0 ? 0 : Math.min(100, Math.round((takenCount / medicines.length) * 100));
      days.push({ day: dayName, date: dateStr, percentage: pct });
    }
    return days;
  }, [historyLog, medicines.length]);

  return (
    <div className="space-y-6 fade-in pb-10">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden min-h-[160px] sm:min-h-[200px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Icons.Heartbeat className="w-48 h-48 sm:w-64 sm:h-64 translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="relative z-10">
          <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-bold mb-4 leading-tight">Good Health, Good Life.</h1>
          {isLoading ? (
            <div className="animate-pulse flex flex-col space-y-2 max-w-lg">
              <div className="h-4 bg-teal-400/50 rounded w-full"></div>
              <div className="h-4 bg-teal-400/50 rounded w-2/3"></div>
            </div>
          ) : (
            <blockquote className="max-w-2xl border-l-4 border-emerald-300 pl-4 italic text-teal-50 text-sm sm:text-lg leading-relaxed">
              "{quote.content}"
              <footer className="mt-2 text-xs sm:text-base font-medium text-emerald-200">— {quote.author}</footer>
            </blockquote>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icons.Check /> Today's Progress
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="p-3 sm:p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
              <p className="text-[10px] sm:text-sm text-teal-600 dark:text-teal-400 font-medium uppercase tracking-wider sm:normal-case">Total Meds</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{todayStats.total}</p>
            </div>
            <div className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <p className="text-[10px] sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider sm:normal-case">Taken</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{todayStats.taken}</p>
            </div>
            <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <p className="text-[10px] sm:text-sm text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider sm:normal-case">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{todayStats.pending}</p>
            </div>
            <div className="p-3 sm:p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
              <p className="text-[10px] sm:text-sm text-rose-600 dark:text-rose-400 font-medium uppercase tracking-wider sm:normal-case">Skipped</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{todayStats.skipped}</p>
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">7-Day Adherence</h3>
          <div className="overflow-x-auto custom-scrollbar pb-2">
            <div className="flex items-end justify-between h-32 gap-2 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl min-w-[400px] sm:min-w-0">
              {weeklyAdherence.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <div className="relative w-full flex justify-center h-20">
                    <div className="absolute bottom-0 w-full max-w-[2rem] bg-teal-500 dark:bg-teal-400 rounded-t-sm transition-all duration-500 ease-out group-hover:bg-emerald-400" style={{ height: `${day.percentage}%` }}>
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 px-1 py-0.5 rounded shadow z-10 transition-opacity">
                        {day.percentage}%
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icons.Shield /> World Health Snapshot
          </h2>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>)}
            </div>
          ) : healthStats ? (
            <div className="space-y-3 flex-1">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Cases</span>
                <span className="font-bold text-gray-900 dark:text-white">{healthStats.cases.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <span className="text-sm text-emerald-700 dark:text-emerald-400">Recovered</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{healthStats.recovered.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                <span className="text-sm text-rose-700 dark:text-rose-400">Deaths</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{healthStats.deaths.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">Data via Disease.sh Open API</p>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Failed to load health stats.</div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.length > 0 ? searchHistory.map((term, idx) => (
                <button key={idx} onClick={() => { localStorage.setItem('mt_temp_search', term); navigate('search'); }} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-full transition-colors">
                  {term}
                </button>
              )) : (
                <span className="text-sm text-gray-400">No recent searches.</span>
              )}
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => navigate('search')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
              <Icons.Search /> Search Drug
            </button>
            <button onClick={() => navigate('tracker')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-medium transition-colors">
              My Medicines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
