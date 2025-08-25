import { useEffect, useState } from 'react';
import { getRelatedProducts } from '../services/productService'; // You’ll define this API

const RelatedProducts = ({ category, currentProductId }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (category) {
      getRelatedProducts(category, currentProductId)
        .then(setRelated)
        .catch(() => setRelated([]));
    }
  }, [category, currentProductId]);

  if (!related.length) return null;

  return (
    <div className="mt-16">
      <h3 className="text-xl font-semibold mb-4">Related Products</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {related.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
            onClick={() => window.location.href = `/product/${item._id}`}
          >
            <div className="h-40 flex items-center justify-center bg-gray-100 rounded-t overflow-hidden">
              <img
                src={item.variations?.[0]?.images?.[0] || '/placeholder.png'}
                alt={item.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
              <p className="text-sm text-green-600 font-semibold">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;