import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { signupUser, verifyOtp, loginUser } from '../services/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import the useAuth hook to get user and role from the context
import { useAuth } from '../Context/AuthContext';

const AuthPanel = ({ onClose, defaultTab = 'signup' }) => {
  const panelRef = useRef(null);
  const otpRef = useRef(null);
  const navigate = useNavigate();

  // Get the setUser function from the AuthContext
  const { setUser } = useAuth();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [step, setStep] = useState('form');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    otp: '',
  });

  useEffect(() => {
    gsap.fromTo(
      panelRef.current,
      { x: '100%' },
      { x: '0%', duration: 1, ease: 'power2.out' }
    );
  }, []);

  useEffect(() => {
    if (step === 'otp') {
      gsap.fromTo(otpRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });
      otpRef.current?.focus();
    }
  }, [step]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await signupUser(formData);
    setIsLoading(false);

    if (res.success) {
      toast.success('Signup successful! Check your email for the OTP.');
      setStep('otp');
    } else {
      toast.error(res.error || 'Signup failed');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await verifyOtp({ email: formData.email, otp: formData.otp });
    setIsLoading(false);

    if (res.success) {
      toast.success('Account verified! You can log in now.');
      setActiveTab('login');
      setStep('form');
    } else {
      toast.error(res.error || 'OTP verification failed');
    }
  };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const res = await loginUser({
//       email: formData.email,
//       password: formData.password,
//     });
//     setIsLoading(false);

//     if (res.success && res.accessToken) {
//       const expiryTime = Date.now() + 2 * 60 * 60 * 1000;

//       // Update the user state in the context
//       setUser({
//         token: res.accessToken,
//         role: res.role,
//         name: res.name,
//         email: res.email,
//         expiry: expiryTime,
//       });
//  localStorage.setItem
//       toast.success('Login successful!');
//       if (res.role === 'seller') {
//         navigate('/seller-store');
//       } else if (res.role === 'admin') {
//         navigate('/admin-dashboard');
//       } else {
//         navigate('/');
//       }
//       onClose?.();
//     } else {
//       toast.error(res.error || 'Login failed');
//     }
//   };
const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await loginUser({
        email: formData.email,
        password: formData.password,
    });
    setIsLoading(false);

    if (res.success && res.accessToken) {
        const expiryTime = Date.now() + 2 * 60 * 60 * 1000;
        
        // Create the user object to be stored
        const authUser = {
            token: res.accessToken,
            role: res.role,
            name: res.name,
            email: res.email,
            expiry: expiryTime,
        };

        // Update the user state in the context
        setUser(authUser);
        
        // ⭐️ CORRECT THIS LINE TO SAVE THE DATA TO LOCAL STORAGE
        localStorage.setItem('authUser', JSON.stringify(authUser));

        toast.success('Login successful!');
        if (res.role === 'seller') {
            navigate('/seller-store');
        } else if (res.role === 'admin') {
            navigate('/admin-dashboard');
        } else {
            navigate('/');
        }
        onClose?.();
    } else {
        toast.error(res.error || 'Login failed');
    }
};
  return (
    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-20 shadow-xl" ref={panelRef}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {activeTab === 'signup'
              ? step === 'form'
                ? 'Sign Up'
                : 'Verify OTP'
              : 'Login'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 space-x-4">
          <button
            onClick={() => { setActiveTab('signup'); setStep('form'); }}
            className={`pb-1 border-b-2 transition ${
              activeTab === 'signup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setActiveTab('login'); setStep('form'); }}
            className={`pb-1 border-b-2 transition ${
              activeTab === 'login' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
            }`}
          >
            Login
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={
            activeTab === 'signup'
              ? step === 'form'
                ? handleSignup
                : handleVerifyOtp
              : handleLogin
          }
        >
          {activeTab === 'signup' && step === 'form' && (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Name"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </>
          )}

          {activeTab === 'signup' && step === 'otp' && (
            <input
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              type="text"
              placeholder="Enter OTP"
              ref={otpRef}
              required
              className="w-full p-2 border border-blue-400 rounded"
            />
          )}

          {activeTab === 'login' && (
            <>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading
              ? 'Processing...'
              : activeTab === 'signup'
              ? step === 'form'
                ? 'Create Account'
                : 'Verify OTP'
              : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPanel;
