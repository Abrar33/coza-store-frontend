import React, { useEffect } from 'react';
import gsap from 'gsap';

const SearchPanel = ({ show, searchRef }) => {
  useEffect(() => {
    if (show && searchRef.current) {
      gsap.fromTo(searchRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
    }
  }, [show]);

  return show ? (
    <div ref={searchRef} className="mb-10 p-6">
      <input
        type="text"
        placeholder="Search product name..."
        className="w-full px-4 py-3 border border-blue-300 rounded outline-none focus:border-blue-500 text-gray-700"
      />
    </div>
  ) : null;
};

export default SearchPanel;