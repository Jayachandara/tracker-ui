import React, { createContext, useContext, useState, ReactNode } from 'react';

type ScrollbarContextValue = {
  showScrollbar: boolean;
  setShowScrollbar: (v: boolean) => void;
};

const ScrollbarContext = createContext<ScrollbarContextValue>({
  showScrollbar: true,
  setShowScrollbar: () => {},
});

export const ScrollbarProvider = ({ children }: { children: ReactNode }) => {
  const storageKey = 'tracker.showScrollbar';
  const [showScrollbar, setShowScrollbar] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw === null ? true : raw === 'true';
    } catch (e) {
      return true;
    }
  });

  // persist changes
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, showScrollbar ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
  }, [showScrollbar]);

  return (
    <ScrollbarContext.Provider value={{ showScrollbar, setShowScrollbar }}>
      {children}
    </ScrollbarContext.Provider>
  );
};

export const useScrollbar = () => useContext(ScrollbarContext);

export default ScrollbarProvider;
