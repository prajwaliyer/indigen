import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './containers/Home';
import Signup from './containers/Signup';
import Login from './containers/Login';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import UserPage from './containers/UserPage';
import FollowersList from './containers/FollowersList';
import FollowingList from './containers/FollowingList';
import VideoPlayer from './components/VideoPlayer';

import Layout from './hocs/Layout';

import { Provider } from 'react-redux';
import store from './store';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';

const ThemedApp = () => {
    const mode = useSelector((state) => state.theme.mode);
    const currentTheme = theme(mode);
  
    return (
      <ThemeProvider theme={currentTheme}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
              <Route path="/activate/:uid/:token" element={<Activate />} />
              <Route path="/logout" element={<Navigate to="/" />} />
              <Route path="/users/:userId" element={<UserPage />} />
              <Route path="/users/:userId/followers" element={<FollowersList />} />
              <Route path="/users/:userId/following" element={<FollowingList />} />
              <Route path="/watch/:videoKey" element={<VideoPlayer />} />
            </Routes>
          </Layout>    
        </Router>
      </ThemeProvider>
    );
  };
  
  const App = () => (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );

export default App;
