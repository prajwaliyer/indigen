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
                main: '#0F0F0F',
            },
            secondary: {
                main: '#19857b',
            },
            tertiary: {
                main: '#005B41',
            },
            background: {
                default: '#0F0F0F',
            },
            navbar: {
                main: '#008170',
            },
        }),
    },
});
  
export default theme;