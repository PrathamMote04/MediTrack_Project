import React, { useState, useEffect, useCallback, useMemo, createContext } from 'react';
import { getTodayString } from '../utils/helpers';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [medicines, setMedicines] = useState([]);
  const [historyLog, setHistoryLog] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSyncing, setIsSyncing] = useState(true);

  // Initial setup: Theme & Mock Authentication
  useEffect(() => {
    const savedTheme = localStorage.getItem('mt_theme');
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    // Set a local user since Firebase is removed
    setUser({ uid: 'local-user', isLocal: true });
  }, []);

  // Data Fetching: LocalStorage only
  useEffect(() => {
    if (!user) return;

    const savedMeds = localStorage.getItem('mt_medicines');
    const savedLog = localStorage.getItem('mt_historyLog');
    const savedSearch = localStorage.getItem('mt_searchHistory');

    if (savedMeds) setMedicines(JSON.parse(savedMeds));
    if (savedLog) setHistoryLog(JSON.parse(savedLog));
    if (savedSearch) setSearchHistory(JSON.parse(savedSearch));
    
    setIsSyncing(false);
  }, [user]);

  const syncData = useCallback(async (newMeds, newLog, newSearch) => {
    setMedicines(newMeds);
    setHistoryLog(newLog);
    setSearchHistory(newSearch);

    localStorage.setItem('mt_medicines', JSON.stringify(newMeds));
    localStorage.setItem('mt_historyLog', JSON.stringify(newLog));
    localStorage.setItem('mt_searchHistory', JSON.stringify(newSearch));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('mt_theme', next);
      if (next === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  }, []);

  const addMedicine = useCallback((med) => {
    const newMeds = [...medicines, { ...med, id: crypto.randomUUID(), addedOn: new Date().toISOString() }];
    syncData(newMeds, historyLog, searchHistory);
  }, [medicines, historyLog, searchHistory, syncData]);

  const removeMedicine = useCallback((id) => {
    const newMeds = medicines.filter(m => m.id !== id);
    syncData(newMeds, historyLog, searchHistory);
  }, [medicines, historyLog, searchHistory, syncData]);

  const markDose = useCallback((id, status) => {
    const today = getTodayString();
    const newLog = {
      ...historyLog,
      [today]: {
        ...(historyLog[today] || {}),
        [id]: status
      }
    };
    syncData(medicines, newLog, searchHistory);
  }, [medicines, historyLog, searchHistory, syncData]);

  const addToHistory = useCallback((term) => {
    if (!term.trim()) return;
    const filtered = searchHistory.filter(item => item.toLowerCase() !== term.toLowerCase());
    const newSearch = [term, ...filtered].slice(0, 5);
    syncData(medicines, historyLog, newSearch);
  }, [medicines, historyLog, searchHistory, syncData]);

  const todayLog = useMemo(() => historyLog[getTodayString()] || {}, [historyLog]);

  return (
    <AppContext.Provider value={{
      user, isSyncing, theme, toggleTheme,
      medicines, addMedicine, removeMedicine,
      todayLog, markDose, historyLog,
      searchHistory, addToHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};
