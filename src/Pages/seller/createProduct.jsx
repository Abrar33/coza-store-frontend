import React from 'react';
import ProductForm from '../../Components/ProductForm';
import { createProduct } from '../../services/productService'; // adjust if path is different
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateProduct = ({  isAdmin ,darkMode}) => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      const result = await createProduct(formData,isAdmin);

      if (result) {
        // Check if the user is an admin and show a different message
        if (isAdmin) {
          toast.success('Product created and approved successfully!');
        } else {
          toast.success('Product created successfully!');
          toast.info('Notification sent to admin, please wait for approval');
        }
        
        navigate(isAdmin ? '/admin-dashboard/products' : '/seller-store/products'); 
      } else {
        toast.error(result.message || 'Failed to create product');
        console.error('Create failed:', result.message);
      }
    } catch (err) {
      console.error('Create error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="p-6">
      <ProductForm onSubmit={handleCreate} darkMode={darkMode} />
    </div>
  );
};

export default CreateProduct;