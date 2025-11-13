import { Theme } from '@mui/material';
import scrollbar from 'theme/styles/scrollbar';
import echart from 'theme/styles/echart';
import { Components } from '@mui/material/styles';
/* import 'simplebar-react/dist/simplebar.min.css';
import simplebar from 'theme/styles/simplebar'; */

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  defaultProps: {},
  styleOverrides: (theme) => ({
    html: {
      scrollBehavior: 'smooth',
    },
    body: {
      ...scrollbar(theme),
    },
    ...echart(),
   /*  ...simplebar(theme), */
  }),
};

export default CssBaseline;
