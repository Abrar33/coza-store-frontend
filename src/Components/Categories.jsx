import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link

const categories = [
 {
  title: "Women’s Wear",
  image: "https://preview.colorlib.com/theme/cozastore/images/banner-01.jpg.webp",
  link: "/shop/women",
 },
 {
  title: "Men’s Fashion",
  image: "https://preview.colorlib.com/theme/cozastore/images/banner-02.jpg.webp",
  link: "/shop/men",
 },
 {
  title: "Accessories",
  image: "https://preview.colorlib.com/theme/cozastore/images/banner-03.jpg.webp",
  link: "/shop/accessories",
 },
];

const Categories = () => {
 return (
  <section className="max-w-screen-2xl mx-auto px-6 py-20">
   <div className="grid md:grid-cols-3 gap-8">
    {categories.map((cat, index) => (
     <div
      key={index}
      className="group flex h-[300px] rounded-lg overflow-hidden shadow-lg relative bg-cover bg-right bg-no-repeat transition-transform duration-300 "
      style={{ backgroundImage: `url(${cat.image})` }}
     >
      {/* Blue Overlay on Hover */}
      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300 z-0"></div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col justify-between w-1/2 p-6">
       <h2 className="text-xl font-bold text-gray-800">{cat.title}</h2>
       <Link // ✅ Replaced 'a' with 'Link'
        to={cat.link} // ✅ Using the 'to' prop
        className="relative text-blue-700 font-semibold hover:text-blue-900 transition"
       >
        Shop Now
        <span className="block h-[2px] w-0 bg-blue-700 mt-1 transition-all duration-300 group-hover:w-20"></span>
       </Link>
      </div>
     </div>
    ))}
   </div>
  </section>
 );
};

export default Categories;