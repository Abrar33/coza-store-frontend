import { useState } from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import Categories from '../Components/Categories';
import ProductOverview from '../Components/ProductsOverwiew';
import Footer from '../Components/Footer';
import Cart from '../Components/Cart';
import ProductList from '../Components/ProductList';

const Home = () => {
  const [showCart, setShowCart] = useState(false);
  
  // The role and navigation logic have been moved to RoleRouter
  // so they are no longer needed in this component.

  const cartItems = [
    { title: "Sneakers", image: "...", quantity: 2, amount: 59.99 },
    { title: "Leather Bag", image: "...", quantity: 1, amount: 89.99 },
  ];

  return (
    <>
      <div className="relative">
        <Hero />
        {showCart && (
          <Cart
            showCart={showCart}
            closeCart={() => setShowCart(false)}
            cartItems={cartItems}
          />
        )}
      </div>
      <Categories />
      <ProductList />
    </>
  );
};

export default Home;
