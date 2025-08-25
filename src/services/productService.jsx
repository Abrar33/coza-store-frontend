// import { db } from '../firebaseConfig'; // make sure the path is correct
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig'; // Adjust the import path as necessary
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = 'http://localhost:3000/api/products';
const ADMIN_BASE_URL = 'http://localhost:3000/api/admin';

// Helper function to create a notification in Firebase Firestore
const createFirebaseNotification = async (message, productId) => {
  try {
    await addDoc(collection(db, "notifications"), {
      message,
      productId,
      seen: false,
      createdAt: serverTimestamp(),
    });
    console.log("Firebase notification added successfully");
  } catch (err) {
    console.error("Failed to add Firebase notification:", err);
  }
};
// Helper function to get and validate the authentication token
const getAuthToken = () => {
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  if (!authUser || !authUser.token) {
    console.error('Authentication token not found. Please log in.');
    // You might want to throw an error or redirect the user to a login page
    throw new Error('Authentication token not found');
  }
  return authUser.token;
};

// ... (rest of your imports and createFirebaseNotification function) ...

export const getAllProducts = async () => {
 const res = await axios.get(`${BASE_URL}/public`);
 return res.data; 
};

export const getAllProductsAdmin = async () => {
  const token = getAuthToken(); // Use the helper function
  const res = await axios.get(`${ADMIN_BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

export const getAllSellers = async () => {
  const token = getAuthToken(); // Use the helper function
  const res = await axios.get('http://localhost:3000/api/admin/sellers', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

export const getRelatedProducts = async (category, excludeId) => {
 const res = await fetch(`/api/products?category=${category}`);
 const data = await res.json();
 return data.filter(p => p._id !== excludeId).slice(0, 6);
};

export const getSellerProducts = async () => {
  const token = getAuthToken(); // Use the helper function
  const res = await fetch(`${BASE_URL}/seller-products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};

export const createProduct = async (productData, isAdmin) => {
 const form = new FormData();
 form.append('name', productData.name);
 form.append('description', productData.description);
 form.append('price', productData.price.toString());
 form.append('category', productData.category);
 form.append('stock', productData.stock.toString());

 if (productData.sale) {
  form.append('sale', productData.sale.toString());
 }

 productData.tags.forEach(tag => {
  form.append('tags', tag);
 });

 // ✅ Safe variations
if (Array.isArray(productData.variations)) {
  const bareVariations = productData.variations.map(v => ({
    size: v.size || '',
    color: v.color || '',
    imageCount: v.images?.length || 0,
  }));

  form.append('variations', JSON.stringify(bareVariations));

  productData.variations.forEach(variation => {
    if (Array.isArray(variation.images)) {
      variation.images.forEach(file => form.append('images', file));
    }
  });
} else {
  // Always send something valid
  form.append('variations', '[]');
}

console.log("product data",productData)
console.log("📦 variations appended:", form.get("variations"));
 const token = getAuthToken();
 
 // 💥 Correct the URL based on user role
 const endpoint = isAdmin ? `${ADMIN_BASE_URL}/products/create` : `${BASE_URL}/create`;

 try {
  const response = await fetch(endpoint, {
   method: 'POST',
   headers: {
    Authorization: `Bearer ${token}`,
   },
   body: form,
  });
 
  if (!response.ok) {
   const err = await response.json();
   throw new Error(err.error || 'Failed to create product');
  }

  const data = await response.json();
 
  if (!isAdmin) {
   await createFirebaseNotification(`New product pending approval: ${data.product.name}`, data.product._id);
  }

  return data;
 } catch (error) {
  console.error("API call error:", error);
  throw error;
 }
};


export const updateProduct = async (productId, productData) => {
  const form = new FormData();
  form.append('name', productData.name);
  form.append('description', productData.description);
  form.append('price', productData.price.toString());
  form.append('category', productData.category);
  form.append('stock', productData.stock.toString());

  if (productData.sale) {
    form.append('sale', productData.sale.toString());
  }

  // Handle tags
  productData.tags.forEach(tag => {
    form.append('tags', tag);
  });

  // Handle variations and images
  const bareVariations = productData.variations.map(v => {
    // Collect new files and existing image URLs
    const newImages = Array.isArray(v.images)
      ? v.images.filter(img => img instanceof File)
      : [];
    const existingImages = Array.isArray(v.images)
      ? v.images.filter(img => typeof img === 'string')
      : [];

    // Append new image files to FormData
    newImages.forEach(file => form.append('images', file));

    return {
      size: v.size || '',
      color: v.color || '',
      images: existingImages, // Send only the existing URLs to the backend
      imageCount: newImages.length, // Let the backend know how many new images to expect
    };
  });
  form.append('variations', JSON.stringify(bareVariations));

  const token = getAuthToken();
  const endpoint = `${BASE_URL}/${productId}`;

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Do not set 'Content-Type': 'application/json' when using FormData
      },
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update product');
    }

    return data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const getSingleProduct = async (productId) => {
 const res = await fetch(`${BASE_URL}/public/${productId}`);
 return await res.json();
};

export const getAdminProduct = async (productId) => {
  const token = getAuthToken(); // Use the helper function
  const res = await fetch(`${ADMIN_BASE_URL}/products/${productId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch admin product');
  }
  return await res.json();
};

export const deleteProduct = async (productId) => {
  const token = getAuthToken(); // Use the helper function
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};

export const handleApprove = async (product) => {
  
  try {
    const token = getAuthToken(); // Use the helper function
    await fetch(`http://localhost:3000/api/admin/${product._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Product approved');
    await createFirebaseNotification(`New product approved by Admin: ${product.name}`, product._id);
    
  } catch (err) {
    console.error(err);
    toast.error('Failed to approve');
  }
};

export const handleReject = async (product) => {
  try {
    const token = getAuthToken(); // Use the helper function
    await fetch(`${ADMIN_BASE_URL}/products/${product._id}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Product rejected');
    await createFirebaseNotification(`New product rejected by Admin: ${product.name}`, product._id);
  } catch (err) {
    console.error(err);
    alert('Failed to reject');
  }
};