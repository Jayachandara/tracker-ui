import React, { createContext, useContext, useState, ReactNode } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Settings from 'pages/settings/Settings';

type SettingsDrawerContextValue = {
  open: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const SettingsDrawerContext = createContext<SettingsDrawerContextValue>({
  open: false,
  openSettings: () => {},
  closeSettings: () => {},
});

export const SettingsDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const openSettings = () => setOpen(true);
  const closeSettings = () => setOpen(false);

  return (
    <SettingsDrawerContext.Provider value={{ open, openSettings, closeSettings }}>
      {children}

      <Drawer anchor="right" open={open} onClose={closeSettings} PaperProps={{ sx: { width: { xs: '100%', sm: 480 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={closeSettings} aria-label="close settings drawer">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          <Settings />
        </Box>
      </Drawer>
    </SettingsDrawerContext.Provider>
  );
};

export const useSettingsDrawer = () => useContext(SettingsDrawerContext);

export default SettingsDrawerProvider;
