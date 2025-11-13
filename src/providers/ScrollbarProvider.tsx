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
  const [showScrollbar, setShowScrollbar] = useState<boolean>(true);
  return (
    <ScrollbarContext.Provider value={{ showScrollbar, setShowScrollbar }}>
      {children}
    </ScrollbarContext.Provider>
  );
};

export const useScrollbar = () => useContext(ScrollbarContext);

export default ScrollbarProvider;
