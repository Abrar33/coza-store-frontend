import React from 'react';

const teamMembers = [
  {
    name: 'Ayesha Khan',
    role: 'Lead UI Designer',
    image: '',
    bio: 'Crafts intuitive interfaces and pixel-perfect layouts that elevate user experience.',
  },
  {
    name: 'Zain Raza',
    role: 'Backend Architect',
    image: '/images/team/zain.jpg',
    bio: 'Builds scalable APIs and ensures data flows like poetry in motion.',
  },
  {
    name: 'Mehak Ali',
    role: 'Product Strategist',
    image: '/images/team/mehak.jpg',
    bio: 'Turns user insights into product magic with empathy and precision.',
  },
  {
    name: 'Abrar',
    role: 'Platform Engineer',
    image: '/images/team/abrar.jpg',
    bio: 'Architects modular systems and dynamic experiences that delight users and developers alike.',
  },
];

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] overflow-hidden">
        <img
          src="https://img.freepik.com/premium-photo/composition-with-smartphone-used-digital-shopping-online-ordering_23-2151380469.jpg"
          alt="About Coza Store"
          className="w-full h-full object-cover object-center opacity-80 z-50"
        />
        <div className="absolute inset-0 bg-blac bg-opacity-20 z-10 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-5xl font-extrabold tracking-tight drop-shadow-lg">
            Welcome to Coza Store
          </h1>
          <p className="mt-4 text-white text-lg max-w-2xl font-light opacity-90">
            Where style meets substance, and every product tells a story.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          At Coza Store, we believe shopping should be more than a transaction — it should be an experience.
          Our mission is to empower creators, connect communities, and deliver products that elevate everyday life.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">Our Vision</h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          To become the most trusted multi-vendor platform in the region — where innovation, authenticity, and customer delight converge.
        </p>
      </section>

      {/* Values Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          {[
            {
              title: '🛠️ Craftsmanship',
              desc: 'We curate products that are built to last — with attention to detail and a passion for quality.',
            },
            {
              title: '🤝 Community',
              desc: 'Our platform is powered by people — from local artisans to global brands, united by purpose.',
            },
            {
              title: '🚀 Innovation',
              desc: 'We’re constantly evolving — integrating smart tech, seamless UX, and future-ready features.',
            },
          ].map((value, i) => (
            <div key={i} className="bg-white p-8 rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Makers */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Meet the Makers</h2>
          <p className="text-lg text-gray-600 mb-12">
            The minds behind the magic — passionate, curious, and committed to excellence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-60 transition duration-300 flex flex-col justify-center items-center text-white px-4 text-center">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm italic mb-2">{member.role}</p>
                  <p className="text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Join the Coza Movement</h2>
        <p className="text-lg mb-6">Whether you're a seller, shopper, or supporter — there's a place for you here.</p>
        <a
          href="/signup"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </section>

      {/* Pro Tips Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">🧠 Pro Tips for Future Enhancement</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-4">
            <li><strong>CMS Integration:</strong> Use Sanity, Strapi, or Contentful to manage team bios and images dynamically.</li>
            <li><strong>Localization:</strong> Add multilingual support using i18n libraries like react-i18next.</li>
            <li><strong>Animations:</strong> Use Framer Motion or GSAP for smooth transitions and hover effects.</li>
            <li><strong>Accessibility:</strong> Ensure alt text, keyboard navigation, and contrast ratios meet WCAG standards.</li>
            <li><strong>SEO Optimization:</strong> Add structured data (JSON-LD) for better search visibility.</li>
            <li><strong>Performance:</strong> Lazy-load images and use responsive formats (WebP) for faster load times.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;