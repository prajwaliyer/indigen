import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../reducers/authSlice';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [requestSent, setRequestSent] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ email }));
    setRequestSent(true);
  };

  if (requestSent) {
    return <Navigate to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '15px', backgroundColor: '#232D3F' }}>
        <Typography component="h1" variant="h5" color="white">
          Request Password Reset
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            InputProps={{
              style: { color: '#fff' },
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Reset
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
