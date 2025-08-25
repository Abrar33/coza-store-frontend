import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../Components/ProductForm';
import { updateProduct } from '../../services/productService';
import { toast } from 'react-toastify';

const UpdateProduct = ({isAdmin,darkMode}) => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const product = state?.product;

  const handleUpdate = async (updatedData) => {
    try {
      const result = await updateProduct(id, updatedData);
console.log('Submitting data:', updatedData); 
      if (result) {
        toast.success('Product updated successfully!');
        const path=isAdmin?"/admin-dashboard/products":"seller-store/products"
        navigate(path);
      } else {
        toast.error(result?.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Update Product
      </h1>
      {product ? (
        <ProductForm
          onSubmit={handleUpdate}
          initialData={product}
          darkMode={darkMode}
        />
      ) : (
        <p>Loading product data...</p>
      )}
    </div>
  );
};

export default UpdateProduct;
