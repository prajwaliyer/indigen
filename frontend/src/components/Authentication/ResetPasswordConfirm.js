import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPasswordConfirm } from '../../reducers/authSlice';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';

const ResetPasswordConfirm = () => {
  const dispatch = useDispatch();
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: ''
  });

  const { new_password, re_new_password } = formData;
  let location = useLocation();
  const params = location.pathname.split('/');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    const uid = params[4];
    const token = params[5];
    dispatch(resetPasswordConfirm({ uid, token, new_password, re_new_password }));
    setRequestSent(true);
  };

  if (requestSent) {
    return <Navigate to="/login" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '15px', backgroundColor: '#232D3F' }}>
        <Typography component="h1" variant="h5" color="white">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="new_password"
            label="New Password"
            type="password"
            id="new_password"
            autoComplete="new-password"
            value={new_password}
            onChange={onChange}
            variant="outlined"
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            InputProps={{
              style: { color: '#fff' },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="re_new_password"
            label="Confirm New Password"
            type="password"
            id="re_new_password"
            autoComplete="new-password"
            value={re_new_password}
            onChange={onChange}
            variant="outlined"
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            InputProps={{
              style: { color: '#fff' },
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Reset Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordConfirm;
