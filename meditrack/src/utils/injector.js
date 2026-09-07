export const injectDependencies = () => {
  if (typeof document === 'undefined') return;

  if (!document.getElementById('tailwind-cdn')) {
    const script = document.createElement('script');
    script.id = 'tailwind-cdn';
    script.src = 'https://cdn.tailwindcss.com';
    script.onload = () => {
      window.tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] },
            colors: {
              teal: { 50: '#f0fdfa', 600: '#0d9488' },
              emerald: { 500: '#10b981' },
              rose: { 500: '#f43f5e' },
              amber: { 500: '#f59e0b' },
              slate: { 800: '#1e293b', 900: '#0f172a' }
            }
          }
        }
      };
    };
    document.head.appendChild(script);
  }

  if (!document.getElementById('google-fonts')) {
    const link = document.createElement('link');
    link.id = 'google-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  if (!document.getElementById('global-styles')) {
    const style = document.createElement('style');
    style.id = 'global-styles';
    style.innerHTML = `
      body { font-family: 'Plus Jakarta Sans', sans-serif; transition: background-color 0.3s ease, color 0.3s ease; }
      .fade-in { animation: fadeIn 0.4s ease-in-out; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        15% { transform: scale(1.2); }
        30% { transform: scale(1); }
        45% { transform: scale(1.15); }
        60% { transform: scale(1); }
      }
      .heart-animate { animation: heartbeat 1.5s infinite ease-in-out; }
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
      .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
    `;
    document.head.appendChild(style);
  }
};
