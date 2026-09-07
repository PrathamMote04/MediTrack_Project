import React, { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import AppContent from './AppContent';
import { injectDependencies } from './utils/injector';

function App() {
  useEffect(() => {
    injectDependencies();
  }, []);

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
