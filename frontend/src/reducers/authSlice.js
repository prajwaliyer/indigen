import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, thunkAPI) => {
        if (!localStorage.getItem('access')) {
            return thunkAPI.rejectWithValue('No access token found');
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const googleAuthenticate = createAsyncThunk(
    'auth/googleAuthenticate',
    async ({ state, code }, thunkAPI) => {
        if (state && code && !localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            const details = {
                'state': state,
                'code': code
            };
            const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?${formBody}`, config);
                return response.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
        }
    }
);

export const checkAuthenticated = createAsyncThunk(
    'auth/checkAuthenticated',
    async (_, thunkAPI) => {
        if (localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            const body = JSON.stringify({ token: localStorage.getItem('access') });
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config);
                return response.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
        } else {
            return thunkAPI.rejectWithValue('No access token found');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkAPI) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log("login thunk")
        const body = JSON.stringify({ email, password });
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async ({ first_name, last_name, email, password, re_password }, thunkAPI) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ first_name, last_name, email, password, re_password });
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, body, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const verify = createAsyncThunk(
    'auth/verify',
    async ({ uid, token }, thunkAPI) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ uid, token });
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config);
            return;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (email, thunkAPI) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ email });
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, body, config);
            return;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const resetPasswordConfirm = createAsyncThunk(
    'auth/resetPasswordConfirm',
    async ({ uid, token, new_password, re_new_password }, thunkAPI) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ uid, token, new_password, re_new_password });
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config);
            return;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            state.access = null;
            state.refresh = null;
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    extraReducers: {
        // Load User
        [loadUser.fulfilled]: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        [loadUser.rejected]: (state) => {
            state.isAuthenticated = false;
        },
        // Google Authenticate
        [googleAuthenticate.fulfilled]: (state, action) => {
            localStorage.setItem('access', action.payload.access);
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
            state.isAuthenticated = true;
        },
        [googleAuthenticate.rejected]: (state) => {
            state.isAuthenticated = false;
        },
        // Check Authenticated
        [checkAuthenticated.fulfilled]: (state) => {
            state.isAuthenticated = true;
        },
        [checkAuthenticated.rejected]: (state) => {
            state.isAuthenticated = false;
        },
        // Login
        [login.fulfilled]: (state, action) => {
            localStorage.setItem('access', action.payload.access);
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
            state.isAuthenticated = true;
        },
        [login.rejected]: (state) => {
            state.isAuthenticated = false;
        },
        // Signup
        [signup.fulfilled]: (state) => {
            state.isAuthenticated = false;
        },
        [signup.rejected]: (state) => {
            state.isAuthenticated = false;
        },
        // Verify
        [verify.fulfilled]: (state) => {
            state.isAuthenticated = true;
        },
        [verify.rejected]: (state) => {
            state.isAuthenticated = false;
        },
        // Reset Password
        [resetPassword.fulfilled]: (state) => {
            // Handle reset password success
        },
        [resetPassword.rejected]: (state) => {
            // Handle reset password fail
        },
        // Reset Password Confirm
        [resetPasswordConfirm.fulfilled]: (state) => {
            // Handle reset password confirm success
        },
        [resetPasswordConfirm.rejected]: (state) => {
            // Handle reset password confirm fail
        },
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;