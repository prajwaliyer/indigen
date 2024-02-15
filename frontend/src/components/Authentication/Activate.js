import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verify } from '../../reducers/authSlice';
import { Container, Button, Typography, Paper } from '@mui/material';

const Activate = () => {
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();
  let location = useLocation();
  const params = location.pathname.split('/');
  
  const verify_account = e => {
    const uid = params[2];
    const token = params[3];
    dispatch(verify({ uid, token }));
    setVerified(true);
  };

  if (verified) {
    return <Navigate to='/login' />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '15px', backgroundColor: '#232D3F' }}>
        <Typography component="h1" variant="h5" color="white">
          Account Activation
        </Typography>
        <Typography variant="body1" color="white" sx={{ mt: 2, mb: 4 }}>
          Click the button below to verify your account.
        </Typography>
        <Button
          onClick={verify_account}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Activate
        </Button>
      </Paper>
    </Container>
  );
};

export default Activate;
