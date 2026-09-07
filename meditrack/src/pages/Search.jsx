import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import Icons from '../components/common/Icons';
import { fetchDrugLabel, fetchDrugEvents } from '../services/api';

const SearchPage = () => {
  const { addMedicine, addToHistory, searchHistory } = useContext(AppContext);
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [addFormOpenId, setAddFormOpenId] = useState(null);
  const [localFilter, setLocalFilter] = useState('');
  const [formData, setFormData] = useState({ dosage: '', time: '08:00', frequency: 'Daily' });

  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
    const tempSearch = localStorage.getItem('mt_temp_search');
    if (tempSearch) {
      setQuery(tempSearch);
      performSearch(tempSearch);
      localStorage.removeItem('mt_temp_search');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const performSearch = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) { setResults([]); return; }
    
    setIsSearching(true);
    setError(null);
    addToHistory(searchTerm);
    
    try {
      const labels = await fetchDrugLabel(searchTerm);
      const enrichedResults = await Promise.all(labels.map(async (drug, index) => {
        const brandName = drug.openfda?.brand_name?.[0] || 'Unknown Brand';
        const genericName = drug.openfda?.generic_name?.[0] || 'Unknown Generic';
        const eventCount = await fetchDrugEvents(brandName);
        return {
          id: drug.id || `drug-${index}`, brandName, genericName,
          purpose: drug.purpose?.[0] || drug.indications_and_usage?.[0] || 'Information not provided.',
          warnings: drug.warnings?.[0] || drug.boxed_warning?.[0] || 'No warnings found.',
          dosageInfo: drug.dosage_and_administration?.[0] || 'Consult physician.', eventCount
        };
      }));
      setResults(enrichedResults);
    } catch (err) {
      setError(err.message || 'Failed to search medicines.');
    } finally {
      setIsSearching(false);
    }
  }, [addToHistory]);

  const handleInputChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => { performSearch(val); }, 500);
  }, [performSearch]);

  const filteredResults = useMemo(() => {
    if (!localFilter) return results;
    return results.filter(r => 
      r.brandName.toLowerCase().includes(localFilter.toLowerCase()) || 
      r.genericName.toLowerCase().includes(localFilter.toLowerCase())
    );
  }, [results, localFilter]);

  const handleAddSubmit = useCallback((e, drug) => {
    e.preventDefault();
    if (!formData.dosage) return;
    addMedicine({
      name: drug.brandName !== 'Unknown Brand' ? drug.brandName : drug.genericName,
      genericName: drug.genericName, dosage: formData.dosage,
      time: formData.time, frequency: formData.frequency
    });
    setAddFormOpenId(null);
    setFormData({ dosage: '', time: '08:00', frequency: 'Daily' });
  }, [formData, addMedicine]);

  return (
    <div className="space-y-6 fade-in pb-10">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FDA Drug Search</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Icons.Search /></div>
          <input
            ref={searchInputRef} type="text" value={query} onChange={handleInputChange}
            placeholder="Search by brand name (e.g., Tylenol, Advil)..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
          />
        </div>
        
        {results.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between">
            <input type="text" value={localFilter} onChange={(e) => setLocalFilter(e.target.value)} placeholder="Filter results..." className="px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-teal-500 text-gray-900 dark:text-white" />
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-xs text-gray-500">History:</span>
              {searchHistory.slice(0,3).map(term => (
                <button key={term} onClick={() => { setQuery(term); performSearch(term); }} className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-gray-700 dark:text-gray-300">{term}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        {isSearching && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 animate-pulse flex flex-col gap-3">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div className="h-10 bg-gray-100 dark:bg-slate-900 rounded w-full mt-4"></div>
              </div>
            ))}
          </div>
        )}

        {error && !isSearching && (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-6 rounded-2xl border border-rose-200 dark:border-rose-800/50 flex flex-col items-center text-center">
            <Icons.AlertCircle />
            <h3 className="font-semibold mt-2">Search Failed</h3>
            <p className="text-sm mt-1">{error}</p>
            <button onClick={() => performSearch(query)} className="mt-4 px-4 py-2 bg-rose-100 dark:bg-rose-800 hover:bg-rose-200 dark:hover:bg-rose-700 rounded-lg text-sm font-medium transition-colors">Try Again</button>
          </div>
        )}

        {!isSearching && !error && query && results.length === 0 && (
          <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>No medicines found for "{query}".</p>
          </div>
        )}

        {!isSearching && !error && filteredResults.length > 0 && (
          <div className="space-y-4">
            {filteredResults.map(drug => (
              <div key={drug.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{drug.brandName}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{drug.genericName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {drug.eventCount > 0 && (
                      <span title="Reported Adverse Events (FDA)" className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                        <Icons.AlertCircle /> <span className="ml-1">{drug.eventCount} events</span>
                      </span>
                    )}
                    <button onClick={() => setAddFormOpenId(addFormOpenId === drug.id ? null : drug.id)} className="inline-flex items-center gap-1 bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 dark:text-teal-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                      <Icons.Plus /> {addFormOpenId === drug.id ? 'Cancel' : 'Add to My Medicines'}
                    </button>
                  </div>
                </div>

                {addFormOpenId === drug.id && (
                  <form onSubmit={(e) => handleAddSubmit(e, drug)} className="mb-6 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row flex-wrap gap-4 items-end fade-in">
                    <div className="w-full sm:flex-1 min-w-[150px]">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dosage (e.g. 500mg)</label>
                      <input required type="text" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-teal-500 text-gray-900 dark:text-white" />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                      <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-teal-500 text-gray-900 dark:text-white" />
                    </div>
                    <div className="w-full sm:w-40">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                      <select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-teal-500 text-gray-900 dark:text-white">
                        <option>Daily</option><option>Twice Daily</option><option>Weekly</option><option>As Needed</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">Save Medicine</button>
                  </form>
                )}

                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Purpose:</strong>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{drug.purpose}</p>
                  </div>
                  
                  {expandedCardId === drug.id ? (
                    <div className="fade-in space-y-3">
                      <div className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30">
                        <strong className="text-rose-700 dark:text-rose-400 flex items-center gap-1"><Icons.AlertCircle /> Warnings:</strong>
                        <p className="text-rose-600 dark:text-rose-300 mt-1">{drug.warnings}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <strong className="text-blue-700 dark:text-blue-400">Dosage & Administration:</strong>
                        <p className="text-blue-600 dark:text-blue-300 mt-1">{drug.dosageInfo}</p>
                      </div>
                      <button onClick={() => setExpandedCardId(null)} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">Show Less ↑</button>
                    </div>
                  ) : (
                    <button onClick={() => setExpandedCardId(drug.id)} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">Read Full Label & Warnings ↓</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
