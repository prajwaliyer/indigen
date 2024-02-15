import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home';
import Signup from './components/Authentication/Signup';
import Verify from './components/Authentication/Verify';
import Login from './components/Authentication/Login';
import Activate from './components/Authentication/Activate';
import ResetPassword from './components/Authentication/ResetPassword';
import ResetPasswordConfirm from './components/Authentication/ResetPasswordConfirm';
import UserPage from './components/Profile/UserPage';
import FollowersList from './components/Profile/FollowersList';
import FollowingList from './components/Profile/FollowingList';
import MoviePlayer from './components/VideoPlayers/MoviePlayer.js';
import ShortsPlayer from './components/Discover/ShortsPlayer';

import Layout from './hocs/Layout';

import { Provider } from 'react-redux';
import store from './store';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';
import CssBaseline from '@mui/material/CssBaseline';
import CreatePost from './components/CreatePost.js';
import AccountSettings from './components/Profile/AccountSettings.js';

const ThemedApp = () => {
    const mode = useSelector((state) => state.theme.mode);
    const currentTheme = theme(mode);
  
    return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/trending" />} />
              <Route path="/discover" element={<ShortsPlayer />} />
              <Route path="/trending" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
              <Route path="/activate/:uid/:token" element={<Activate />} />
              <Route path="/logout" element={<Navigate to="/" />} />
              <Route path="/users/:userId" element={<UserPage />} />
              <Route path="/users/:userId/followers" element={<FollowersList />} />
              <Route path="/users/:userId/following" element={<FollowingList />} />
              <Route path="/watch/video/:videoKey" element={<MoviePlayer />} />
              <Route path="/watch/trailer/:videoKey" element={<MoviePlayer />} />
              <Route path="/movie/:postId" element={<ShortsPlayer />} />
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
