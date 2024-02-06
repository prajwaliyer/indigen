import React, { useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkAuthenticated, loadUser, googleAuthenticate } from '../reducers/authSlice';
import queryString from 'query-string';

const Layout = ({ children }) => {
    const dispatch = useDispatch();
    let location = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state;
        const code = values.code;

        if (location.pathname === '/login/callback' && state && code) {
            dispatch(googleAuthenticate({ state, code }))
              .unwrap()
              .then(() => {
                    dispatch(loadUser());
                    navigate('/');
              })
              .catch((error) => {
                    console.log(error);
              });
        } else {
            dispatch(checkAuthenticated());
            dispatch(loadUser());
        }
    }, [dispatch, location, navigate]);
    
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default Layout;
