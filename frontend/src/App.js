import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './containers/Home';
import Signup from './containers/Authentication/Signup';
import Login from './containers/Authentication/Login';
import Activate from './containers/Authentication/Activate';
import ResetPassword from './containers/Authentication/ResetPassword';
import ResetPasswordConfirm from './containers/Authentication/ResetPasswordConfirm';
import UserPage from './containers/UserPage/UserPage';
import FollowersList from './containers/UserPage/FollowersList';
import FollowingList from './containers/UserPage/FollowingList';
import VideoPlayer from './components/VideoPlayer';

import Layout from './hocs/Layout';

import { Provider } from 'react-redux';
import store from './store';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';
import CssBaseline from '@mui/material/CssBaseline';
import Create from './containers/Create.js';
import CreatePost from './components/CreatePost.js';

const ThemedApp = () => {
    const mode = useSelector((state) => state.theme.mode);
    const currentTheme = theme(mode);
  
    return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Navigate to="/" />} />
              <Route path="/trending" element={<Navigate to="/" />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
              <Route path="/activate/:uid/:token" element={<Activate />} />
              <Route path="/logout" element={<Navigate to="/" />} />
              <Route path="/users/:userId" element={<UserPage />} />
              <Route path="/users/:userId/followers" element={<FollowersList />} />
              <Route path="/users/:userId/following" element={<FollowingList />} />
              <Route path="/watch/video/:videoKey" element={<VideoPlayer />} />
              <Route path="/watch/trailer/:videoKey" element={<VideoPlayer />} />
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
