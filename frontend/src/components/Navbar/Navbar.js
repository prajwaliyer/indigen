import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import indigenLogo from '../../assets/indigen_logo.png';

import { Link } from 'react-router-dom';
import { logout } from '../../reducers/authSlice';

import { toggleDarkMode } from '../../reducers/theme';
import { useTheme } from '@mui/material/styles';

const guestPages = ['Discover', 'Trending'];
const authPages = ['Discover', 'Trending'];
const settings = ['Profile', 'Account', 'Logout'];

function Navbar() {
  // Imports
  const dispatch = useDispatch();
  const theme = useTheme();

  // Initializations
  const [openNavMenu, setOpenNavMenu] = React.useState(null);
  const [openUserMenu, setOpenUserMenu] = React.useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id);

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

    const authMenuLinks = () => {
      const pages = isAuthenticated ? [...authPages, 'Create'] : authPages;

      return pages.map((page) => (
        <MenuItem 
          key={page} 
          component={Link}
          to={`/${page.toLowerCase()}`}
          onClick={handleToggleNavMenu}
        >
          <Typography textAlign="center">{page}</Typography>
        </MenuItem>
      ))
    };

  const guestLinks = () => (
    guestPages.map((page) => (
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
          {/* Mobile view */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleToggleNavMenu}
              color="inherit"
              sx={{ marginLeft: isAuthenticated ? 0 : 'auto' }}
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

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'center', ml: 11 }}>
            <Link to="/">
              <img
                src={indigenLogo}
                alt="Indigen Logo"
                style={{ height: '50px' }}
              />
            </Link>
          </Box>

          {/* Desktop view */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1.5 }}>
            <Link to="/">
              <img 
                src={indigenLogo} 
                alt="Indigen Logo" 
                style={{ height: '50px' }} 
              />
            </Link>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1.575, justifyContent: 'flex-start' }}>
              {isAuthenticated ? authLinks() : guestLinks()}
          </Box>

          <Box sx={{ flexGrow: 0, width: 150, display: 'flex', justifyContent: 'flex-end' }}>
            {isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to="/create"
                  sx={{ my: 2, color: 'white', display: { xs: 'none', md: 'block' }, mr: 2 }}
                >
                  Create
                </Button>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleToggleUserMenu} sx={{ p: 0, fontSize: 'large' }}>
                      <AccountCircleOutlinedIcon fontSize="large" />
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
                      to={setting === 'Profile' ? `/users/${userId}` : `/${setting.toLowerCase()}`}
                      onClick={setting === 'Logout' ? handleLogout : handleToggleUserMenu}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
