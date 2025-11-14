import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';

const Menu: Components<Omit<Theme, 'components'>>['MuiMenu'] = {
  defaultProps: {},
  styleOverrides: {
    paper: ({ theme }: any) => ({
      minWidth: theme.spacing(22.625),
      borderRadius: theme.shape.borderRadius * 2,
    }),
  },
};

export default Menu;
