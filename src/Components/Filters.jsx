import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const FilterPanel = ({ show, headingRefs, panelRef }) => {
  useEffect(() => {
    if (show && panelRef.current) {
      gsap.fromTo(panelRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
      gsap.fromTo(
        headingRefs.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }
      );
    } else if (!show && panelRef.current) {
      gsap.to(panelRef.current, { y: 30, opacity: 0, duration: 0.3 });
    }
  }, [show]);

  const sections = [
    { title: 'Sort By', items: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Name: A-Z'] },
    { title: 'Price', items: ['$0 - $50', '$50 - $100', '$100 - $200'] },
    { title: 'Color', items: ['Black', 'Red', 'Blue', 'Green'], isColor: true },
    { title: 'Tags', items: ['Casual', 'Formal', 'Outdoor', 'Trending'] },
  ];

  return show ? (
    <div ref={panelRef} className="grid md:grid-cols-4 gap-6 p-6 mb-10 bg-blue-50 rounded shadow-md">
      {sections.map((section, i) => (
        <div key={i}>
          <h4 ref={(el) => (headingRefs.current[i] = el)} className="text-sm font-bold text-gray-700 mb-2">
            {section.title}
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {section.items.map((item, j) => (
              <li key={j} className={`flex items-center gap-2 ${section.isColor ? 'text-gray-700' : ''}`}>
                {section.isColor && (
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.toLowerCase() }}
                  ></span>
                )}
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ) : null;
};

export default FilterPanel;