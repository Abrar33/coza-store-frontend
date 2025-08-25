import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { signupUser, verifyOtp } from '../services/authService';

const AuthPane = ({ onClose }) => {
  const panelRef = useRef(null);
  const otpRef = useRef(null);

  const [activeTab, setActiveTab] = useState('signup');
  const [step, setStep] = useState('form'); // 'form' → 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    otp: ''
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
    }
  }, [step]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await signupUser(formData);
    if (res.success) {
      setStep('otp');
    } else {
      console.error('Signup failed', res.error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const res = await verifyOtp({ email: formData.email, otp: formData.otp });
    if (res.verified) {
      alert('Account verified! You can log in now.');
      setActiveTab('login');
      setStep('form');
    } else {
      console.error('OTP failed', res.error);
    }
  };

  return (
  <> <div
      className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-20 shadow-xl"
      ref={panelRef}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {activeTab === 'signup' ? (step === 'form' ? 'Sign Up' : 'Verify OTP') : 'Login'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => {
              setActiveTab('signup');
              setStep('form');
            }}
            className={`mr-4 ${activeTab === 'signup' ? 'font-bold text-blue-600' : 'text-gray-600'}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setActiveTab('login');
              setStep('form');
            }}
            className={`${activeTab === 'login' ? 'font-bold text-blue-600' : 'text-gray-600'}`}
          >
            Login
          </button>
        </div>

        <form className="space-y-4" onSubmit={activeTab === 'signup' && step === 'form' ? handleSignup : activeTab === 'signup' && step === 'otp' ? handleVerifyOtp : undefined}>
          {activeTab === 'signup' && step === 'form' && (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </>
          )}

          {activeTab === 'signup' && step === 'otp' && (
            <div ref={otpRef}>
              <input
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                type="text"
                placeholder="Enter OTP"
                className="w-full p-2 border border-blue-300 rounded"
              />
            </div>
          )}

          {activeTab === 'login' && (
            <>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {activeTab === 'signup'
              ? step === 'form'
                ? 'Create Account'
                : 'Verify OTP'
              : 'Login'}
          </button>
        </form>
      </div>
    </div></>
  );
};

export default AuthPane; 