import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SignUpImg from '../assets/sugnuo.avif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import './input.css';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/auth.service';

const SignUp = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const isFormValid = Object.values(formData).every(val => val.trim() !== '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!isFormValid) {
      setError('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password validation (at least 6 characters)
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        username: formData.username
      });
      
      setIsLoggedIn(true);
      setUser(response.user);
      
      // If onboarding is needed, redirect to onboarding page, otherwise to dashboard
      if (!response.user.profile_complete) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <div className="hidden md:block w-1/2 h-full">
        <img src={SignUpImg} alt="Sign Up" className="w-full h-full object-cover" />
      </div>

      <div className="w-full md:w-1/2 h-full flex justify-center items-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Join Untitled AI and boost your interview skills
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {['Username', 'Email', 'Password'].map((label, index) => {
              const key = label.toLowerCase() as 'username' | 'email' | 'password';
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
                  className="peer w-full border-b-2 border-gray-300 bg-transparent py-2 px-1 text-md 
                            focus:outline-none focus:border-blue-600 autofill:bg-transparent"
                />
                <label
                  htmlFor={key}
                  className="absolute left-1 text-gray-500 text-md transition-all duration-300 ease-in-out
                    peer-placeholder-shown:top-2.5
                    peer-placeholder-shown:text-md
                    peer-focus:top-[-20px]
                    peer-focus:text-sm
                    peer-focus:text-blue-600
                    peer-not-placeholder-shown:top-[-20px]
                    peer-not-placeholder-shown:text-sm
                    peer-not-placeholder-shown:text-blue-600"
                >
                  {label}
                </label>
              </div>
            )})}

            <div className="text-sm text-gray-600">
              <p>
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full mt-6">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`p-2 rounded-md transition text-white w-full md:w-[45%] text-md flex items-center justify-center gap-2
                  ${isFormValid ? 'bg-black cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Sign Up
              </button>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-black border border-gray-800 p-2 rounded-md hover:bg-black hover:text-white transition w-full md:w-[45%]"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
