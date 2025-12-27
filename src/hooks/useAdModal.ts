import { useState, useEffect, useCallback, useRef } from 'react';

const AD_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const LAST_AD_SHOWN_KEY = 'lastAdShownTimestamp';

export function useAdModal() {
  const [adModalState, setAdModalState] = useState<{ isOpen: boolean; timestamp: number }>({ 
    isOpen: false, 
    timestamp: 0 
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkAndShowAd = useCallback(() => {
    const lastShown = localStorage.getItem(LAST_AD_SHOWN_KEY);
    const now = Date.now();
    
    if (!lastShown) {
      // First time - show ad after 5 minutes
      localStorage.setItem(LAST_AD_SHOWN_KEY, now.toString());
      return;
    }

    const lastShownTime = parseInt(lastShown, 10);
    const timeSinceLastAd = now - lastShownTime;

    if (timeSinceLastAd >= AD_INTERVAL) {
      setAdModalState({ isOpen: true, timestamp: now });
      localStorage.setItem(LAST_AD_SHOWN_KEY, now.toString());
    }
  }, []);

  useEffect(() => {
    // Set up interval to check every minute
    intervalRef.current = setInterval(checkAndShowAd, 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkAndShowAd]);

  const closeAdModal = useCallback(() => {
    setAdModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    isAdModalOpen: adModalState.isOpen,
    adModalTimestamp: adModalState.timestamp,
    closeAdModal,
  };
}
