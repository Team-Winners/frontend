import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginImg from '../assets/homepage5.avif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import './input.css';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/auth.service';

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const isFormValid = Object.values(formData).every(val => val.trim() !== '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });
      setIsLoggedIn(true);
      setUser(response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      {/* Left side image */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src={LoginImg}
          alt="Login"
          className="w-full h-full object-cover brightness-95"
        />
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 h-full flex justify-center items-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-black">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your personalized <span className="font-semibold text-black">Untitled AI</span>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {['Email', 'Password'].map((label, index) => {
              const key = label.toLowerCase() as 'email' | 'password';
              return (
                <div key={index} className="relative">
                  <input
                    type={key === 'password' ? 'password' : 'text'}
                    name={key}
                    placeholder=" "
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="peer w-full border-b border-black bg-transparent py-3 px-2 text-md text-black placeholder-transparent focus:outline-none focus:border-blue-500"
                  />
                  <label
                    htmlFor={key}
                    className="absolute left-2 text-gray-500 text-sm transition-all duration-300 ease-in-out
                      peer-placeholder-shown:top-3.5
                      peer-focus:top-[-14px]
                      peer-focus:text-sm
                      peer-focus:text-blue-600"
                  >
                    {label}
                  </label>
                </div>
              );
            })}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500 transition">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full mt-6">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`p-2 rounded-md transition w-full md:w-[45%] text-md flex items-center justify-center gap-2
                  ${isFormValid
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                Sign In
              </button>
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 text-black border border-black p-2 rounded-md hover:bg-black hover:text-white transition w-full md:w-[45%]"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
