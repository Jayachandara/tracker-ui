import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'simplebar/dist/simplebar.min.css';
import { RouterProvider } from 'react-router-dom';
import { theme } from './theme/theme.ts';
import { CssBaseline, ThemeProvider } from '@mui/material';
import BreakpointsProvider from 'providers/BreakpointsProvider.tsx';
import ScrollbarProvider from 'providers/ScrollbarProvider.tsx';
import router from 'routes/router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ScrollbarProvider>
        <BreakpointsProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </BreakpointsProvider>
      </ScrollbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
