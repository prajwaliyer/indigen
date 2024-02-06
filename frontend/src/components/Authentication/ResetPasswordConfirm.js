import React, { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPasswordConfirm } from '../../reducers/authSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();

  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    new_password:'',
    re_new_password:''
  });

  const {new_password, re_new_password} = formData;

  let location = useLocation();
  const params = location.pathname.split('/')
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    const uid = params[4];
    const token = params[5];
    dispatch(resetPasswordConfirm({ uid,token,new_password, re_new_password }));
    setRequestSent(true);
  };

  if (requestSent) {
    return <Navigate to='/login' />
  }

  return (
    <div className='container mt-5'>
      <h1>Reset Password</h1>
      <form onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            className='form-control'
            type='password'
            placeholder='New Password'
            name='new_password'
            value={new_password}
            onChange={e => onChange(e)}
            minLength='6'
            required
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control'
            type='password'
            placeholder='Confirm New Password'
            name='re_new_password'
            value={re_new_password}
            onChange={e => onChange(e)}
            minLength='6'
            required
          />
        </div>
        <button className='btn btn-primary' to='/' type='submit'>Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;