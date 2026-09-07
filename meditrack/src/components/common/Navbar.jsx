import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Icons from './Icons';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { theme, toggleTheme, medicines, user, isSyncing } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'search', label: 'Drug Search' },
    { id: 'tracker', label: 'My Medicines', count: medicines.length },
    { id: 'about', label: 'About' }
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                <Icons.Heartbeat className="w-5 h-5 text-rose-500 heart-animate" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 leading-none">
                  MediTrack
                </span>
                {/* {!isSyncing && (
                  <span className="text-[10px] font-medium flex items-center gap-1 mt-0.5 text-gray-500 dark:text-gray-400">
                    Local Storage
                  </span>
                )} */}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  currentPage === link.id 
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
                {link.count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-rose-500 rounded-full">
                    {link.count}
                  </span>
                )}
              </button>
            ))}
            
            <div className="w-px h-6 bg-gray-200 dark:bg-slate-800 mx-2"></div>
            
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800 transition-all active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center md:hidden gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 fade-in absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { setCurrentPage(link.id); setIsMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === link.id ? 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'text-gray-600'
                }`}
              >
                {link.label}
                {link.count > 0 && <span className="ml-2 text-white bg-rose-500 rounded-full px-2 py-0.5 text-xs">{link.count}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
