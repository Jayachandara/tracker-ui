import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';

const Badge: Components<Omit<Theme, 'components'>>['MuiBadge'] = {
  defaultProps: {},
  styleOverrides: {
    badge: ({ theme }: any) => ({
      color: theme.palette.common.white,
      padding: 0,
    }),
  },
};

export default Badge;
