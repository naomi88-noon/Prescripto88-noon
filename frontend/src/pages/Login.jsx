import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const Login = () => {
  const [state, setState] = useState('Sign Up'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('error'); 
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setMessage(null);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    setMessageType('error');

    // Basic validation
    if (!email || !password || (state === 'Sign Up' && !name)) {
      setMessage('Please fill in all required fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (state === 'Sign Up') {
        // REGISTER
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/register`,
          { name, email, password },
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('Register response:', data);

        if (data?.user) {
          setMessage(`Account created for ${data.user.name}! Redirecting to login...`);
          setMessageType('success');
          setTimeout(() => {
            setState('Login');
            resetForm();
          }, 2000);
        }

      } else {
        // LOGIN
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/login`,
          { email, password },
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('Login response:', data);

        if (data?.accessToken && data?.user) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));

          setMessage(`Welcome back, ${data.user.name}!`);
          setMessageType('success');

          setTimeout(() => {
            window.location.href = '/doctors'; 
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Authentication error:', err.response?.data || err.message);

      // Default error message
      let errorMessage = 'Something went wrong. Please try again.';

      if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto item-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up to create your account' : 'login to access your account'}</p>

        {state === 'Sign Up' && (
          <div className="w-full">
            <p className="mb-1 font-medium">Full Name</p>
            <input
              type="text"
              placeholder="Enter full name"
              className="border border-zinc-300 rounded w-full p-2 mt-1 focus:border-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p className="mb-1 font-medium">Email</p>
          <input
            type="email"
            placeholder="Enter email"
            className="border border-zinc-300 rounded w-full p-2 mt-1 focus:border-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-1 font-medium">Password</p>
          <input
            type="password"
            placeholder="Enter password"
            className="border border-zinc-300 rounded w-full p-2 mt-1 focus:border-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        {message && (
          <div className={`p-3 rounded-md ${
            messageType === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 px-4 rounded-md text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <div className="text-center mt-2">
          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <span
                className="text-blue-600 hover:text-blue-700 underline cursor-pointer font-medium"
                onClick={() => { setState('Login'); resetForm(); }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span
                className="text-blue-600 hover:text-blue-700 underline cursor-pointer font-medium"
                onClick={() => { setState('Sign Up'); resetForm(); }}
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
