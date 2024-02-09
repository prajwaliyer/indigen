import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../reducers/authSlice';
import axios from 'axios';
import { Button, TextField, Typography, Box, Container, Paper, Link as MuiLink, Alert } from '@mui/material';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
    general: ''
  });

  const { email, password } = formData;
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setErrorMessages({ email: '', password: '', general: '' }); // Reset error messages

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/'); // Navigate to home page on successful login
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Set error messages based on the response from the server
        setErrorMessages(prev => ({
          ...prev,
          general: 'Invalid credentials. Please try again.'
        }));
      } else {
        setErrorMessages(prev => ({
          ...prev,
          general: 'Invalid credentials. Please try again.'
        }));
      }
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '15px', backgroundColor: '#232D3F' }}>
        <Typography component="h1" variant="h5" color="white">
          Sign In
        </Typography>
        {errorMessages.general && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {errorMessages.general}
          </Alert>
        )}
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
            onChange={onChange}
            variant="outlined"
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            InputProps={{
              style: { color: '#fff' },
            }}
            error={!!errorMessages.email}
            helperText={errorMessages.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChange}
            variant="outlined"
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            InputProps={{
              style: { color: '#fff' },
            }}
            error={!!errorMessages.password}
            helperText={errorMessages.password}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Typography variant="body2" color="white" align="center">
            Forgot your password? <MuiLink component={Link} to="/reset-password" underline="hover" sx={{ color: '#4fc3f7' }}>Reset Password</MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
