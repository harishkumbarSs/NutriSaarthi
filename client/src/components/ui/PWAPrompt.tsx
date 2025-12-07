/**
 * PWA Update Prompt
 * =================
 * Shows when a new version of the app is available.
 */

import { useRegisterSW } from 'virtual:pwa-register/react';
import { useState } from 'react';

export const PWAPrompt = () => {
  const [show, setShow] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
    onNeedRefresh() {
      setShow(true);
    },
  });

  const close = () => {
    setNeedRefresh(false);
    setShow(false);
  };

  if (!needRefresh || !show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="glass-card p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-theme-primary">
              Update Available
            </h4>
            <p className="text-xs text-theme-secondary mt-0.5">
              A new version of NutriSaarthi is ready. Reload to update.
            </p>
          </div>
          <button
            onClick={close}
            className="text-theme-tertiary hover:text-theme-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={close}
            className="flex-1 py-2 px-3 text-sm font-medium text-theme-secondary hover:text-theme-primary rounded-lg border border-theme-border hover:bg-theme-surface-hover transition-colors"
          >
            Later
          </button>
          <button
            onClick={() => updateServiceWorker(true)}
            className="flex-1 py-2 px-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors"
          >
            Reload Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAPrompt;

