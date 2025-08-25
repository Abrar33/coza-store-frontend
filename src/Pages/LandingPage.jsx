import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import AuthPanel from '../Components/AuthPanel';
import heroBg from '../assets/hero.jpg';
import { useNavigate } from 'react-router-dom';

const LandingPage = ({showAuth:defaultShowAuth}) => {
  const [showAuth, setShowAuth] = useState(defaultShowAuth || false);
  const textRef = useRef(null);
  const navigate = useNavigate();

  // Redirect if user already authenticated
  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    if (authUser && authUser.token && authUser.expiry > Date.now()) {
      navigate('/home');
    }
  }, [navigate]);

  // Animation for heading
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.6,
        ease: 'power4.out',
      });
    });
    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Content */}
      <div className="text-center text-white z-10 px-4 sm:px-8 max-w-2xl">
        <h1
          ref={textRef}
          className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg"
        >
          Welcome to ShopSphere
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl drop-shadow-sm">
          Your orbit of style and experience
        </p>
        <button
          onClick={() => setShowAuth(true)}
          className="mt-8 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-200 transition duration-300 shadow-lg"
        >
          Shop smarter — join us today
        </button>
      </div>

      {/* Auth Panel Modal */}
      {showAuth && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <AuthPanel onClose={() => setShowAuth(false)} defaultTab="login"/>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
