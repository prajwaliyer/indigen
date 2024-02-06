import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verify } from '../../reducers/authSlice';

const Activate = () => {
  const [verified, setVerified] = useState(false);

  const dispatch = useDispatch();

  let location = useLocation();
  const params = location.pathname.split('/')
  console.log(params)

  const verify_account = e => {
    const uid = params[2];
    const token = params[3];
    dispatch(verify({ uid, token }));
    setVerified(true);
  };

  if (verified) {
    return <Navigate to='/login' />
  }

  return (
    <div className='container'>
      <div 
        className='d-flex flex-column justify-content-center align-items-center'
        style={{ marginTop: '100px' }}
      >
        <h2>Account Activation</h2>
        <h3>Click the button below to verify your account</h3>
        <button
          onClick={verify_account}
          style={{ marginTop: '50px' }}
          type='button'
          className='btn btn-primary'
        >
          Activate
        </button>
      </div>
    </div>
  );
};

export default Activate;