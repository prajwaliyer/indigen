import { createTheme } from '@mui/material/styles';

const theme = (mode) => createTheme({
    palette: {
        mode,
        ...(mode === 'light'
        ? {
            primary: {
                main: '#556cd6',
            },
            secondary: {
                main: '#19857b',
            },
            navbar: {
                main: '#FF0000',
            },
        }
        : {
            primary: {
                main: '#556cd6',
            },
            secondary: {
                main: '#19857b',
            },
            navbar: {
                main: '#00FF00',
            },
        }),
    },
});
  
export default theme;