import { Box, FormControlLabel, Switch, Stack, Typography } from '@mui/material';
import React from 'react';
import { useScrollbar } from 'providers/ScrollbarProvider.tsx';

const Settings = () => {
  const { showScrollbar, setShowScrollbar } = useScrollbar();

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowScrollbar(event.target.checked);
  };

  return (
    <Box p={3}>
      <Stack spacing={2} maxWidth={720}>
        <Typography variant="h4">Settings</Typography>
        <FormControlLabel
          control={<Switch checked={showScrollbar} onChange={handleToggle} />}
          label="Show custom scrollbars"
        />
      </Stack>
    </Box>
  );
};

export default Settings;
