import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signup } from '../../reducers/authSlice';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';

const Signup = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [accountCreated, setAccountCreated] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: ''
  });

  const { first_name, last_name, email, password, re_password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (password === re_password) {
      dispatch(signup({ first_name, last_name, email, password, re_password }));
      setAccountCreated(true);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  if (accountCreated) {
    return <Navigate to="/login" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '15px', backgroundColor: '#232D3F' }}>
        <Typography component="h1" variant="h5" color="white">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="First Name"
            name="first_name"
            autoComplete="fname"
            autoFocus
            value={first_name}
            onChange={onChange}
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
            id="last_name"
            label="Last Name"
            name="last_name"
            autoComplete="lname"
            value={last_name}
            onChange={onChange}
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={onChange}
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
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={onChange}
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
            name="re_password"
            label="Confirm Password"
            type="password"
            id="re_password"
            autoComplete="new-password"
            value={re_password}
            onChange={onChange}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            InputProps={{
              style: { color: '#fff' },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          {/* <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2, borderColor: 'red', color: 'red' }}
            onClick={() => {}}
          >
            Signup with Google
          </Button> */}
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Typography variant="body2" color="white">
              Already have an account? <Link to="/login" style={{ color: '#1976d2' }}>Sign In</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
