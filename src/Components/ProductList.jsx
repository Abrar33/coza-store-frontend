import { useEffect, useState } from 'react';
import ProductOverview from './ProductsOverwiew';
import { getAllProducts } from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        if (Array.isArray(res)) {
          setProducts(res);
          console.log('Fetched products:', res);
        } else {
          console.error('Invalid product response:', res);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  if (!products.length) {
    return <p className="text-center text-gray-500">No products found.</p>;
  }

  return (
    <div className="p-4">
     
      <ProductOverview products={products} />
    </div>
  );
};

export default ProductList;