import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser, registerUser, logout as logoutAction, updateProfile } from '../store/slices/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((s) => s.auth);

  const login = useCallback(async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}! 👋`);
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  }, [dispatch, navigate]);

  const register = useCallback(async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      toast.success(`Account created! Welcome, ${result.payload.user.name}! 🎉`);
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  }, [dispatch, navigate]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    toast.success('Logged out. See you soon!');
    navigate('/login');
  }, [dispatch, navigate]);

  const update = useCallback(async (data) => {
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated!');
    } else {
      toast.error(result.payload || 'Update failed');
    }
  }, [dispatch]);

  return { user, token, isAuthenticated, loading, error, login, register, logout, update };
}
