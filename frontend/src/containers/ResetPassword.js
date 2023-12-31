import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../reducers/authSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();

  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    email:''
  });

  const { email } = formData;
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
      e.preventDefault();
      dispatch(resetPassword({ email }));
      setRequestSent(true);
  };

  if (requestSent) {
    return <Navigate to='/' />
  }

  return (
    <div className='container mt-5'>
      <h1>Request Password Reset</h1>
      <form onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
              <input
                className='form-control'
                type='email'
                placeholder='Email'
                name='email'
                value={email}
                onChange={e => onChange(e)}
                required
              />
          </div>
          <button className='btn btn-primary' to='/' type='submit'>Reset</button>
      </form>
    </div>
  );
};

export default ResetPassword;