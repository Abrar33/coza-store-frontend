// frontend/components/ProductForm.jsx

import React, { useState } from 'react';

// Data for dynamic categories and sizes without sub-categories
const categoriesData = {
  'Apparel': ['S', 'M', 'L', 'XL', '2XL'],
  'Footwear': ['40', '41', '42', '43', '44', '45'],
  'Hoodies': ['S', 'M', 'L', 'XL'],
  'Jackets': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'Coats': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'Clothes': ['One Size'],
  'Perfumes': ['50ml', '100ml', '200ml'],
  'Accessories': ['One Size'],
  'Electronics': ['512GB', '1TB', '2TB'],
  'Books': ['Softcover', 'Hardcover'],
};

const tagOptions = ['summer', 'winter', 'men', 'new arrival', 'features'];

const ProductForm = ({ onSubmit, initialData = {}, darkMode }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    category: initialData.category || '',
    stock: initialData.stock || '',
    sale: !!initialData.sale,
    tags: Array.isArray(initialData.tags) ? initialData.tags : [],
    // ✅ Ensure variations is always an array
    variations: Array.isArray(initialData.variations) && initialData.variations.length
      ? initialData.variations.map(v => ({
          size: v.size || '',
          color: v.color || '',
          // Ensure images is always an array
          images: Array.isArray(v.images) ? v.images : [],
        }))
      : [{ size: '', color: '', images: [] }],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // ✅ On category change, variations are reset but initialized correctly
        variations: [{ size: '', color: '', images: [] }],
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagChange = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...formData.variations];
    newVariations[index][field] = value;
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  const addVariation = () => {
    setFormData((prev) => ({
      ...prev,
      variations: [...prev.variations, { size: '', color: '', images: [] }],
    }));
  };

  const removeVariation = (index) => {
    const newVariations = [...formData.variations];
    newVariations.splice(index, 1);
    // ✅ If no variations are left, re-initialize with one empty object
    setFormData((prev) => ({ 
      ...prev, 
      variations: newVariations.length > 0 ? newVariations : [{ size: '', color: '', images: [] }]
    }));
  };
    
  // Determine available sizes based on the selected category
  const availableSizes = categoriesData[formData.category] || [];

  const validateBeforeSubmit = () => {
    if (!formData.name.trim()) {
      alert('Product name is required'); return false;
    }
    if (!formData.description.trim()) {
      alert('Description is required'); return false;
    }
    if (!formData.price || isNaN(formData.price)) {
      alert('Valid price is required'); return false;
    }
    if (!formData.category.trim()) {
      alert('Category is required'); return false;
    }
    if (!formData.stock || isNaN(formData.stock)) {
      alert('Valid stock quantity is required'); return false;
    }
    // Optional: validate variations
    if (formData.variations.some(v => v.size === '' || v.color === '')) {
      alert('All variations must have a size and color.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateBeforeSubmit()) return;
    try {
      // ✅ Pass the complete formData object to the onSubmit prop
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const inputStyle = `${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none`;
  const labelStyle = `${darkMode ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium mb-1`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg">
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {initialData._id ? 'Update Product' : 'Create New Product'}
      </h2>
      
      {/* Main Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>Product Name</label>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Stylish T-Shirt" className={inputStyle} required />
        </div>
        <div>
          <label className={labelStyle}>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 19.99" className={inputStyle} required />
        </div>
        <div>
          <label className={labelStyle}>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className={inputStyle} required>
            <option value="">Select a category</option>
            {Object.keys(categoriesData).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
        </div>
        <div>
          <label className={labelStyle}>Stock Quantity</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="e.g. 50" className={inputStyle} required />
        </div>
      </div>
      <div>
        <label className={labelStyle}>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Write product details..." className={`${inputStyle} resize-none`} />
      </div>
      <div>
        <label className={labelStyle}>Tags</label>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (<button type="button" key={tag} onClick={() => handleTagChange(tag)} className={`px-3 py-1 text-sm rounded-full border transition ${formData.tags.includes(tag) ? 'bg-blue-600 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}`}>{tag}</button>))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="sale" checked={formData.sale} onChange={handleChange} className="w-5 h-5 cursor-pointer" id="saleToggle" />
        <label htmlFor="saleToggle" className={labelStyle}>Sale (20% off)</label>
      </div>
      
      {/* Variations */}
      <div className={`rounded-xl p-4 mt-4 shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Product Variations</h3>
        {formData.variations.map((variation, index) => (
          <div key={index} className="space-y-4 mb-6 border-b pb-4 last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <label className={labelStyle}>Size</label>
                <select name="size" value={variation.size} onChange={(e) => handleVariationChange(index, 'size', e.target.value)} className={inputStyle} required>
                  <option value="">Select size</option>
                  {availableSizes.map(size => (<option key={size} value={size}>{size}</option>))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className={labelStyle}>Color</label>
                <input type="text" value={variation.color} onChange={(e) => handleVariationChange(index, 'color', e.target.value)} placeholder="e.g. Red, Blue" className={inputStyle} required />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Images</label>
                <div className="flex flex-wrap gap-3">
                  {variation.images.map((img, imgIdx) => (<div key={imgIdx} className="relative w-20 h-20 rounded border overflow-hidden group"><img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt={`var-${index}-img-${imgIdx}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-1 transition"><label className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-1 py-0.5 rounded cursor-pointer"><input type="file" accept="image/*" hidden onChange={(e) => { if (e.target.files[0]) { const newVariations = [...formData.variations]; newVariations[index].images[imgIdx] = e.target.files[0]; setFormData({ ...formData, variations: newVariations }); } }} />Edit</label><button type="button" className="text-xs bg-red-500 hover:bg-red-600 text-white px-1 py-0.5 rounded" onClick={() => { const newVariations = [...formData.variations]; newVariations[index].images.splice(imgIdx, 1); setFormData({ ...formData, variations: newVariations }); }}>×</button></div></div>))}
                  <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed text-2xl text-gray-400 cursor-pointer hover:border-blue-400">+<input type="file" accept="image/*" hidden onChange={(e) => { if (e.target.files.length) { const newVariations = [...formData.variations]; newVariations[index].images.push(e.target.files[0]); setFormData({ ...formData, variations: newVariations }); } }} /></label>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button type="button" onClick={() => removeVariation(index)} className="text-red-600 text-sm hover:underline">Remove Variation</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addVariation} className="mt-2 text-blue-600 text-sm hover:underline">+ Add Variation</button>
      </div>
      
      {/* Submit */}
      <div className="pt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition">
          {initialData._id ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;