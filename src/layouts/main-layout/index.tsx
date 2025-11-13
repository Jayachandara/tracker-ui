import { PropsWithChildren, ReactElement, useState } from 'react';
import { Box, Drawer, Stack, Toolbar } from '@mui/material';

import Sidebar from 'layouts/main-layout/Sidebar/Sidebar';
import Topbar from 'layouts/main-layout/Topbar/Topbar';
import Footer from './Footer';

export const drawerWidth = 278;

const MainLayout = ({ children }: PropsWithChildren): ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <>
      <Stack direction="row" sx={{m:'0 20px'}} minHeight="100vh" bgcolor="background.default">
        <Topbar handleDrawerToggle={handleDrawerToggle} />
        <Toolbar
          sx={{
            pt: 8,
            width: 1,
            pb: 0,
          }}
        >
          {children}
        </Toolbar>
      </Stack>
    </>
  );
};

export default MainLayout;
