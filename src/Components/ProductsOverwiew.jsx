import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FilterPanel from "./Filters";
import SearchPanel from "./Search";

const categories = ["All Product", "Women", "Men", "Bag"];

const ProductOverview = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Product");
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const headingRefs = useRef([]);
  headingRefs.current = [];

  const navigate = useNavigate();

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
    setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    setShowFilter(false);
  };

  const handleQuickView = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const filteredProducts =
    selectedCategory === "All Product"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">PRODUCT OVERVIEW</h2>

      {/* Category & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
        <div className="flex flex-wrap gap-6 text-sm font-semibold text-gray-700">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`group relative pb-1 ${
                selectedCategory === cat ? "text-blue-600" : "hover:text-blue-600"
              } transition-colors`}
            >
              {cat}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 ${
                  selectedCategory === cat ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </button>
          ))}
        </div>

        <div className="flex gap-4 text-sm font-semibold text-gray-700">
          <button
            onClick={toggleFilter}
            className="flex items-center gap-2 border px-4 py-2 rounded hover:text-blue-600 hover:border-blue-600 transition"
          >
            <span>Filter</span>
          </button>
          <button
            onClick={toggleSearch}
            className="flex items-center gap-2 border px-4 py-2 rounded hover:text-blue-600 hover:border-blue-600 transition"
          >
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Modular Panels */}
      <FilterPanel show={showFilter} headingRefs={headingRefs} panelRef={panelRef} />
      <SearchPanel show={showSearch} searchRef={searchRef} />

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="relative bg-white rounded shadow-md group hover:shadow-lg transition flex flex-col h-[420px] p-4"
          >
            <div className="w-full h-[260px] overflow-hidden rounded mb-4 relative">
              <img
                src={product?.variations?.find(v => Array.isArray(v.images) && v.images.length)?.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => handleQuickView(product)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-100 text-gray-600 text-sm rounded-2xl opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white font-bold"
              >
                Quick View
              </button>
            </div>

            <div className="flex items-start justify-between mb-1">
              <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
            </div>

            <p className="text-blue-600 font-bold">{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductOverview;