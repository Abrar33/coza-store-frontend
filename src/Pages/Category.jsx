import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../Context/ProductContext'; // Assuming you have a ProductContext

// This configuration is used for the static page content like titles and banners.
const categoryConfig = {
  men: {
    title: 'The Modern Gentleman',
    subtitle: 'Redefine your style with our exclusive collection.',
    banner: 'https://preview.colorlib.com/theme/cozastore/images/slide-03.jpg.webp',
    introHeading: 'Curated for the Discerning Man',
    introText:
      'Discover a fusion of timeless design and modern craftsmanship. Each piece in our collection is a testament to quality, style, and effortless sophistication.',
  },
  women: {
    title: 'Elegance Redefined',
    subtitle: 'Step into sophistication with our women’s collection.',
    banner: 'https://dhanak.com.pk/cdn/shop/files/IMG_4615.jpg?v=1747900315&width=2000',
    introHeading: 'Designed for Grace and Power',
    introText:
      'From flowing silhouettes to bold statements, our women’s collection celebrates individuality and elegance.',
  },
  bags: {
    title: 'Carry with Confidence',
    subtitle: 'Functional fashion for every journey.',
    banner: 'https://i.pinimg.com/originals/4a/5b/6c/4a5b6c7d8e9f0a1b2c3d4e5f6g7h8i9j.jpg',
    introHeading: 'Built to Move with You',
    introText:
      'Explore our collection of bags designed for style, durability, and everyday convenience.',
  },
};

const CategoryPage = () => {
  const { category } = useParams();
  const config = categoryConfig[category?.toLowerCase()] || categoryConfig['men']; // fallback to 'men'
console.log('categ',category)
  // Use the useProducts hook to get products and loading state from your context
  const { products, loading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
console.log(products)
  // Filter products whenever the category or the product list changes
  useEffect(() => {
    if (products) {
      const categoryProducts = products.filter(
        (product) => product.category.toLowerCase() === category?.toLowerCase()
      );
      setFilteredProducts(categoryProducts);
    }
  }, [products, category]);

  // Handle loading and no-product states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
      {/* Hero Section */}
      <header className="relative w-full h-[80vh] md:h-[110vh] overflow-hidden">
        <img
          src={config.banner}
          alt={`${category} banner`}
          className="w-full h-full z-50 object-cover object-center"
        />
        <div className="absolute inset-0 bg-black opacity-50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-5xl font-extrabold tracking-tighter drop-shadow-lg capitalize">
            {config.title}
          </h1>
          <p className="mt-4 text-white text-lg max-w-2xl font-light opacity-90">
            {config.subtitle}
          </p>
          <button className="mt-8 px-10 py-4 bg-white text-gray-900 font-bold text-sm uppercase rounded-full shadow-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
            Shop Now
          </button>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">{config.introHeading}</h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          {config.introText}
        </p>
      </section>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <section className="max-w-screen-2xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group relative overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="relative w-full h-80 md:h-96 overflow-hidden">
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                <p className="text-2xl font-extrabold text-blue-700 tracking-tight">₹{product.price.toFixed(2)}</p>
                <button className="mt-4 w-full py-3 bg-gray-900 text-white font-semibold text-sm rounded-lg uppercase tracking-wider opacity-90 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="flex justify-center items-center h-48">
          <p className="text-lg text-gray-600">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
