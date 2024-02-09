import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import indigenLogo from '../../assets/indigen_logo.png';

import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../reducers/authSlice';

import { toggleDarkMode } from '../../reducers/theme';
import { useTheme } from '@mui/material/styles';

const guestPages = ['Trending', 'Discover'];
const authPages = ['Trending', 'Discover'];
const settings = ['Profile', 'Account', 'Logout'];

function Navbar() {
  // Imports
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();

  // Initializations
  const [openNavMenu, setOpenNavMenu] = React.useState(null);
  const [openUserMenu, setOpenUserMenu] = React.useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if page is scrolled down, otherwise false
      const position = window.pageYOffset;
      setIsScrolled(position > 0);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const authLinks = () => (
    authPages.map((page) => {
      const toPath = `/${page.toLowerCase()}`;
      const isCurrentPage = location.pathname === toPath;
      return (
        <Button
          key={page}
          component={Link}
          to={toPath}
          sx={{ my: 2, color: 'white', display: 'block', backgroundColor: isCurrentPage ? 'rgba(0, 0, 0, 0.1)' : 'transparent', borderRadius: '5px' }}
        >
          <Typography 
            textAlign="center" 
            sx={{
              fontFamily: 'Inter, sans-serif',
              textTransform: 'none',
              fontWeight: '500',
              fontSize: '0.95rem',
            }}
          >
            {page}
          </Typography>
        </Button>
      );
    })
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
          {page}
        </MenuItem>
      ))
    };

  const guestLinks = () => (
    guestPages.map((page) => {
      const toPath = `/${page.toLowerCase()}`;
      const isCurrentPage = location.pathname === toPath;
      return (
        <Button
        key={page}
        component={Link}
        to={toPath}
        sx={{ my: 2, color: 'white', display: 'block', backgroundColor: isCurrentPage ? 'rgba(0, 0, 0, 0.1)' : 'transparent', borderRadius: '5px' }}
      >
        <Typography 
          textAlign="center" 
          sx={{
            fontFamily: 'Inter, sans-serif',
            textTransform: 'none',
            fontWeight: '500',
          }}
        >
          {page}
        </Typography>
      </Button>
      );
    })
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
    <AppBar position="sticky" sx={{ backgroundColor: theme.palette.navbar.main }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters variant="dense" sx={{ maxHeight: '60px', transition: 'all ease', ...(isScrolled && { maxHeight: '40px' }) }}>
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
                style={{ height: '48px' }}
              />
            </Link>
          </Box>

          {/* Desktop view */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1.5 }}>
            <Link to="/">
              <img 
                src={indigenLogo} 
                alt="Indigen Logo" 
                style={{ height: '48px' }} 
              />
            </Link>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1.52, justifyContent: 'flex-start' }}>
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
                  <Typography 
                    textAlign="center" 
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      textTransform: 'none',
                      fontWeight: '500',
                      fontSize: '0.95rem',
                    }}
                  >
                    Create
                  </Typography>
                </Button>
                <Tooltip title="Open settings">
                  <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}> 
                    <IconButton onClick={handleToggleUserMenu} sx={{ p: 0, fontSize: 'large' }}>
                        <AccountCircleOutlinedIcon fontSize="large" />
                    </IconButton>
                  </Box>
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
                <Typography 
                  textAlign="center" 
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'none',
                    fontWeight: '500',
                    fontSize: '0.95rem',
                  }}
                >
                  Login
                </Typography>
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
