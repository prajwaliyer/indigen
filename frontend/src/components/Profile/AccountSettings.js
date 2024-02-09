import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Paper, Button, Box } from '@mui/material';

const AccountSettings = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '15px', backgroundColor: '#232D3F' }}>
        <Typography component="h1" variant="h5" color="white" gutterBottom>
          Account Settings
        </Typography>
        <Box sx={{ mt: 2, width: '100%' }}>
          <Typography variant="body1" color="white" gutterBottom>
            Manage your account settings and set preferences.
          </Typography>
          <Box sx={{ mt: 5 }}>
            <Link
                to="/reset-password"
                fullWidth
                style={{ textDecoration: 'none' }}
            >
                Reset Password
            </Link>
        </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AccountSettings;
