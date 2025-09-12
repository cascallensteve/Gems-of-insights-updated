import React, { useEffect, useState } from 'react';

const SettingsSimple = () => {
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('admin_theme') || 'system');
  const [systemTime, setSystemTime] = useState(new Date());
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const id = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    applyTheme(themeMode);
    // Also persist immediately and notify other tabs
    localStorage.setItem('admin_theme', themeMode);
  }, [themeMode]);

  const applyTheme = (mode) => {
    const root = document.documentElement;
    if (mode === 'light') {
      root.classList.remove('dark');
    } else if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark'); else root.classList.remove('dark');
    }
    localStorage.setItem('admin_theme', mode);
  };

  const formatTime = (d) => d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="p-4">
      <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance & System</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300">Choose theme mode and view system info</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-emerald-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Theme Mode</h2>
            <div className="mt-3 flex gap-2">
              <button
                className={`rounded-md px-3 py-1.5 text-sm ${themeMode==='light' ? 'bg-emerald-700 text-white' : 'border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200'}`}
                onClick={() => setThemeMode('light')}
              >Light</button>
              <button
                className={`rounded-md px-3 py-1.5 text-sm ${themeMode==='dark' ? 'bg-emerald-700 text-white' : 'border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200'}`}
                onClick={() => setThemeMode('dark')}
              >Dark</button>
              <button
                className={`rounded-md px-3 py-1.5 text-sm ${themeMode==='system' ? 'bg-emerald-700 text-white' : 'border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200'}`}
                onClick={() => setThemeMode('system')}
              >System</button>
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">Current: {themeMode.charAt(0).toUpperCase()+themeMode.slice(1)}</p>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">System Info</h2>
            <div className="mt-3 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Timezone</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{timezone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">System Time</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatTime(systemTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSimple;


