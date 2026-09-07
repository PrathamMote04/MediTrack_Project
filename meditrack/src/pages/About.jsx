import React from 'react';
import Icons from '../components/common/Icons';

const AboutPage = () => {
  return (
    <div className="w-full space-y-8 fade-in pb-10">
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-teal-50 dark:bg-teal-900/30 rounded-2xl mb-2">
          <Icons.Heartbeat className="w-8 h-8 text-rose-500 heart-animate" />
        </div>
        <h1 className="text-[clamp(1.75rem,6vw,3rem)] tracking-[0.02em] font-bold text-gray-900 dark:text-white leading-tight">
          About MediTrack
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl">A personal application designed to help users track their daily medications safely and securely.</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-6 rounded-2xl flex gap-4">
        <div className="text-blue-500 mt-1"><Icons.Shield /></div>
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <strong>FDA Disclaimer:</strong> This application utilizes the openFDA API for educational and demonstration purposes. Information provided should not replace professional medical advice. Always consult your physician.
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          &copy; Copyright Developed by Pratham Mote
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
