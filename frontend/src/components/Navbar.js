import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

import { Link } from 'react-router-dom';
import { logout } from '../reducers/authSlice';

import { toggleDarkMode } from '../reducers/theme';
import { useTheme } from '@mui/material/styles';

const guestPages = ['DarkMode', 'Pricing', 'Blog'];
const authPages = ['Products', 'Pricing', 'Blog', 'Dashboard'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
  // Imports
  const dispatch = useDispatch();
  const theme = useTheme();

  // Initializations
  const [openNavMenu, setOpenNavMenu] = React.useState(null);
  const [openUserMenu, setOpenUserMenu] = React.useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const authLinks = () => (
    authPages.map((page) => (
      <Button
        key={page}
        component={Link}
        to={`/${page.toLowerCase()}`}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        {page}
      </Button>
    ))
  );

    const authMenuLinks = () => (
      authPages.map((page) => (
        <MenuItem 
          key={page} 
          component={Link}
          to={`/${page.toLowerCase()}`}
          onClick={handleToggleNavMenu}
        >
          <Typography textAlign="center">{page}</Typography>
        </MenuItem>
      ))
    );

  const guestLinks = () => (
    guestPages.map((page) => (
      <Button
        key={page}
        component={Link}
        to={`/${page.toLowerCase()}`}
        sx={{ my: 2, color: 'white', display: 'block' }}
        onClick={page === 'DarkMode' ? handleToggleDarkMode : undefined}
      >
        {page}
      </Button>
    ))
  );

  const guestMenuLinks = () => (
    guestPages.map((page) => (
      <MenuItem 
        key={page}
        component={Link}
        to={`/${page.toLowerCase()}`}
        onClick={handleToggleNavMenu}
      >
        <Typography textAlign="center">{page}</Typography>
      </MenuItem>
    ))
  );

  // Handlers
  const handleToggleNavMenu = (event) => {
    if (openNavMenu) {
      setOpenNavMenu(null);
    } else {
      setOpenNavMenu(event.currentTarget);
    }
  };

  const handleToggleUserMenu = (event) => {
    if (openUserMenu) {
      setOpenUserMenu(null);
    } else {
      setOpenUserMenu(event.currentTarget);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    handleToggleUserMenu();
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.navbar.main }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleToggleNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={openNavMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(openNavMenu)}
              onClose={handleToggleNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {isAuthenticated ? authMenuLinks() : guestMenuLinks()}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated ? authLinks() : guestLinks()}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleToggleUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={openUserMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(openUserMenu)}
              onClose={handleToggleUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting} 
                  component={Link}
                  to={`/${setting.toLowerCase()}`}
                  onClick={setting === 'Logout' ? handleLogout : handleToggleUserMenu}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
