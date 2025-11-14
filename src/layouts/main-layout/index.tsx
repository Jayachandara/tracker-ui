import { PropsWithChildren, ReactElement, useState } from 'react';
import { Stack, Toolbar } from '@mui/material';

import Topbar from 'layouts/main-layout/Topbar/Topbar';

export const drawerWidth = 278;

const MainLayout = ({ children }: PropsWithChildren): ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
