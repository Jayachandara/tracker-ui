import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';

const Grid2: Components<Omit<Theme, 'components'>>['MuiGrid'] = {
  defaultProps: {},
  styleOverrides: {
    root: () => ({
      marginRight: 0,
    }),
  },
};

export default Grid2;
