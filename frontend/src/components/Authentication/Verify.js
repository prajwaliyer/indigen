import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Verify = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '15px', backgroundColor: '#232D3F' }}>
        <Typography component="h1" variant="h5" color="white">
          Verify Your Email
        </Typography>
        <Typography variant="body2" color="white" sx={{ mt: 2 }}>
          A verification e-mail has been sent. Please check your e-mail to login.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Verify;
