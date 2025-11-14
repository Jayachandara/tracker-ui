import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';

const Tooltip: Components<Omit<Theme, 'components'>>['MuiTooltip'] = {
  defaultProps: {},
  styleOverrides: {
    arrow: ({ theme }: any) => ({
      color: theme.palette.common.black,
    }),
    tooltip: ({ theme }: any) => ({
      backgroundColor: theme.palette.common.black,
    }),
  },
};

export default Tooltip;
