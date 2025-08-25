// ProductContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getAllProducts,
  getAllProductsAdmin,
  getSellerProducts,
  getSingleProduct,
} from '../services/productService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('public'); // 'admin', 'seller', etc.

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let data;
      if (role === 'admin') data = await getAllProductsAdmin();
      else if (role === 'seller') data = await getSellerProducts();
      else data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [role]);

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts, setRole }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);