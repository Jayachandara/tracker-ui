import { Grid, Stack } from '@mui/material';
import { ReactElement } from 'react';

import ExpensesGraph from 'components/sections/dashboard/Home/Sales/Expenses/Expenses';
import SaleInfoCards from 'components/sections/dashboard/Home/Sales/SaleInfoSection/SaleInfoCards';
import OverView from 'components/sections/dashboard/Home/Sales/OverView/OverView';

import { drawerWidth } from 'layouts/main-layout';
import MonthlyTracking from 'components/sections/dashboard/Home/transactions/AllTransactions';

const Dashboard = (): ReactElement => {
  return (
    <Grid
      container
      component="main"
      columns={12}
      spacing={3.75}
      flexGrow={1}
      pt={4.375}
      sx={{
          m: 0,
        width: { md: `calc(100% - ${drawerWidth}px)` },
        pl: { xs: 3.75, lg: 0 },
      }}
    >
      <Grid size={3.5}>
        <MonthlyTracking />
        {/* <TransactionRecords/> */}
      </Grid>
      <Grid size={4.5} >
         <Stack direction={{ sm: 'column' }} gap={3.75}>
            <ExpensesGraph />
            <OverView />
          </Stack>
      </Grid>

       <Grid size={2.5}>
         <SaleInfoCards />
      </Grid>
      
      
      {/* <Grid xs={12} lg={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row', lg: 'column' }}
          gap={3.75}
          width={1}
        >
          <NewCustomers />
          <BuyersProfile />
        </Stack>
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;
