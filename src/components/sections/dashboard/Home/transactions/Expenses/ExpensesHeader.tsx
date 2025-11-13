import { Dispatch, ReactElement, SetStateAction, useMemo, useRef, useState } from 'react';
import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import EChartsReactCore from 'echarts-for-react/lib/core';
import ExpensesChart from './ExpensesChart';
import { SpendCategoryGroupDTO, SpendDTO, SpendsGroupDTO } from 'dtos/transactions-dtos';
import { currencyFormat } from 'helpers/format-functions';

type ExpensesProps = {
  spends: SpendDTO[];
  groupNames: SpendsGroupDTO[]
  spendsGroup: SpendCategoryGroupDTO[]
  setGroupNames: Dispatch<SetStateAction<SpendsGroupDTO[]>>

}
const ExpensesHeader = ({spends, spendsGroup,groupNames, setGroupNames}: ExpensesProps): ReactElement => {
  const theme = useTheme();

  const chartRef = useRef<EChartsReactCore | null>(null);

  const toggleClicked = (name: SpendsGroupDTO) => {
     setGroupNames((prev) => {
    if (!prev.includes(name)) {
      // Add new group
      return [...prev, name];
    } else {
      // Remove only if more than one group is selected
      return prev.length > 1 ? prev.filter((n) => n !== name) : prev;
    }
  });
  };

  return (
      <Stack direction={{ xs: 'row', sm: 'row', md: 'row' }}>
        <Stack direction="row" justifyContent="center" flex={'1 1 0%'}>
          <ExpensesChart
            chartRef={chartRef}
            spends={spends}
            sx={{
              width: 230,
              maxHeight: 230,
              mx: 'auto',
            }}
          />
        </Stack>
        <Stack
          spacing={1}
          divider={<Divider />}
          sx={{ px: 2.5, py: 2.5 }}
          justifyContent="center"
          alignItems="stretch"
          flex={'1 1 0%'}
        >
          {Array.isArray(spendsGroup) &&
            spendsGroup.map((dataItem, index) => (
              <Button
                key={dataItem.group}
                variant="text"
                fullWidth
                onClick={() => {
                  toggleClicked(dataItem.group);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  p: 0,
                  borderRadius: 1,
                  opacity: groupNames.includes(dataItem.group) ? 1: 0.5,
                }}
                disableRipple
              >
                <Stack direction="column" gap={1}>
                  <Typography variant="body2" color={theme.palette.grey[400]} flex={1} textAlign={'left'}>
                    {dataItem.group}
                  </Typography>
                  <Typography variant="h5" color={theme.palette.grey[800]} flex={1} textAlign={'left'}>
                    {currencyFormat(dataItem.totalAmount)}
                  </Typography>
                </Stack>
              </Button>
            ))}
        </Stack>
      </Stack>
  );
};

export default ExpensesHeader;
