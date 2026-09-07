import React, { useState, useContext } from 'react';
import { AppContext } from './context/AppContext';
import Navbar from './components/common/Navbar';
import DashboardPage from './pages/Dashboard';
import SearchPage from './pages/Search';
import TrackerPage from './pages/Tracker';
import AboutPage from './pages/About';
import Icons from './components/common/Icons';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { isSyncing } = useContext(AppContext);
  if (isSyncing) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb', // gray-50 fallback
        zIndex: 99999
      }} className="dark:bg-slate-900">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px'
        }}>
          <div style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            marginBottom: '24px',
            width: '120px',
            height: '120px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* The heart icon now correctly receives these styles */}
            <Icons.Heartbeat 
              style={{ width: '80px', height: '80px', color: '#f43f5e', fill: '#f43f5e' }} 
              className="heart-animate" 
            />
          </div>

          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#111827', // gray-900
            marginBottom: '12px',
            margin: '0',
            letterSpacing: '-0.025em'
          }} className="dark:text-white">
            MediTrack
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f43f5e' }} className="animate-pulse"></div>
            <p style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#6b7280', // gray-500
              margin: '0'
            }} className="dark:text-gray-400">
              Syncing your health data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && <DashboardPage navigate={setCurrentPage} />}
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'tracker' && <TrackerPage navigate={setCurrentPage} />}
        {currentPage === 'about' && <AboutPage />}
      </main>
    </div>
  );
};

export default AppContent;
