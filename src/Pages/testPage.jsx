import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import AuthForm from '../Components/AuthForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo1.png';
import Button from '../utils/Button';
const LandingPage = () => {
  const [authState, setAuthState] = useState('signup');
  const bgOverlayRef = useRef();
  const cardRef = useRef();

  useEffect(() => {
    gsap.set(cardRef.current, { x: 0, opacity: 1 });
  }, []);

  const toggleAuth = () => {
    const tl = gsap.timeline();
    const isMobile = window.innerWidth < 768;

    if (authState === 'signup') {
      tl.to(cardRef.current, {
        x: isMobile ? '20%' : '100%',
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
      });
      tl.to(bgOverlayRef.current, {
        background: 'rgba(79, 70, 229, 0.75)',
        duration: 1,
      }, "<");
      setTimeout(() => setAuthState('signin'), 500);
      tl.to(cardRef.current, {
        x: '0%',
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      });
    } else {
      tl.to(cardRef.current, {
        x: isMobile ? '-20%' : '-100%',
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
      });
      tl.to(bgOverlayRef.current, {
        background: 'rgba(30, 64, 175, 0.75)',
        duration: 1,
      }, "<");
      setTimeout(() => setAuthState('signup'), 500);
      tl.to(cardRef.current, {
        x: '0%',
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div className="relative w-screen min-h-screen overflow-hidden font-sans bg-black">
      {/* Logo */}
      

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('/your-image.jpg')` }}
      />

      {/* Overlay */}
      <div
        ref={bgOverlayRef}
        className="absolute inset-0 z-10 bg-indigo-900/75 backdrop-blur-sm transition-all duration-700"
      />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col md:flex-row w-full h-full p-4 sm:p-8 md:p-12">
        {/* Left Side Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-white mb-10 md:mb-0 md:pr-8">
          <div className="max-w-xl space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Welcome to ShopSphere
            </h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90">
              {authState === 'signup'
                ? 'Already a member? Sign in to your account and continue exploring.'
                : 'New here? Create your account and get started.'}
            </p>
 <Button onClick={toggleAuth} className="mt-4 text-indigo-700 bg-white hover:bg-gray-100">
  {authState === 'signup' ? 'Sign In Instead' : 'Sign Up Instead'}
</Button>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div
            ref={cardRef}
            className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-xl p-6 sm:p-8"
          >
            <AuthForm authState={authState} />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LandingPage;
