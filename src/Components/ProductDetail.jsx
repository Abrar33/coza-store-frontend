import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSingleProduct, handleApprove, handleReject, getAdminProduct } from '../services/productService';
import RelatedProducts from './RelatedProduct';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-toastify';
// Import the useAuth hook to get user and role from the context
import { useAuth } from '../Context/AuthContext';

const ProductDetail = () => {
  // Use the useAuth hook to get the user object
  const { user } = useAuth();
  const { state } = useLocation();
  const { product: stateProduct } = state || {};
  const { id } = useParams();
  const navigate = useNavigate();

  // Get the user's role directly from the context user object
  const role = user?.role || 'buyer';
  const { addToCart } = useCart();

  const [product, setProduct] = useState(stateProduct || null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    // Check for the user object from the context
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return navigate('/signin');
    }

    const selectedVariation = product.variations.find(v => v.color === selectedColor);

    if (!selectedVariation) {
      toast.error("Please select a color/size.");
      return;
    }

    try {
      await addToCart(product._id, quantity);
      toast.success(`${name} added to cart!`);
    } catch (err) {
      toast.error('Failed to add to cart.');
    }
  };

  useEffect(() => {
    if (!stateProduct && id) {
      const fetchProduct = async () => {
        try {
          if (role === 'admin') {
            const product = await getAdminProduct(id);
            setProduct(product);
          } else {
            const product = await getSingleProduct(id);
            setProduct(product);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setProduct(null);
        }
      };
      // Fetch product only if a user is available or if it's a public product (role is 'buyer')
      if (user || role === 'buyer') {
        fetchProduct();
      }
    }
  }, [id, stateProduct, user, role]); // Added user to the dependency array

  const allSizes =
    product?.variations
      ?.map(v => v.size?.split(',').map(s => s.trim()))
      .flat()
      .filter(Boolean) || [];

  const allColors =
    product?.variations?.map(v => v.color).filter(Boolean) || [];

  const colorImages =
    product?.variations
      ?.filter(v => v.color === selectedColor)
      ?.flatMap(v => v.images)
      ?.filter(Boolean) || [];

  useEffect(() => {
    if (allColors.length) {
      setSelectedColor(allColors[0]);
    }
  }, [product]);

  useEffect(() => {
    if (colorImages.length) {
      setSelectedImage(colorImages[0]);
      const interval = setInterval(() => {
        setImageIndex(prev => (prev + 1) % colorImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedColor, product]);

  useEffect(() => {
    if (colorImages.length) {
      setSelectedImage(colorImages[imageIndex]);
    }
  }, [imageIndex, colorImages]);

  if (!product) {
    return <p className="text-center mt-10 text-red-500">Product not found!</p>;
  }

  const { name, price, category, description, status } = product;

  const handleApproveClick = async () => {
    try {
      await handleApprove(product);
      // Use toast for UI messages instead of alert()
      toast.success('Product approved');
      const updated = await getAdminProduct(product._id);
      setProduct(updated);
      navigate(`/admin-dashboard`);
    } catch (err) {
      console.error(err);
      toast.error('Approval failed');
    }
  };

  const handleRejectClick = async () => {
    try {
      await handleReject(product);
      // Use toast for UI messages instead of alert()
      toast.success('Product rejected');
      const updated = await getAdminProduct(product._id);
      setProduct(updated);
    } catch (err) {
      console.error(err);
      toast.error('Rejection failed');
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto h-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        {/* Left Side - Images */}
        <div>
          <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded shadow overflow-hidden mb-4">
            <img
              src={selectedImage}
              alt={name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {colorImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-20 h-20 object-cover rounded cursor-pointer border"
                onMouseEnter={() => {
                  setSelectedImage(img);
                  setImageIndex(idx);
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Details */}
        <div>
          <p className="text-blue-600 font-semibold mb-2 capitalize">{category || 'Product'}</p>
          <h2 className="text-2xl font-bold mb-2">{name}</h2>
          <p className="text-xl text-green-600 font-bold mb-1">₹{price}</p>
          <p className="text-sm text-gray-500 mb-4">Delivery: Free</p>

          {/* Description */}
          {description && (
            <div className="mb-6">
              <p className="font-semibold mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          )}

          {/* Sizes */}
          {allSizes.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {allSizes.map((size, idx) => (
                  <button key={idx} className="px-3 py-1 border rounded hover:bg-gray-100">
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {allColors.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Colors</p>
              <div className="flex gap-2">
                {allColors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-full border cursor-pointer ${
                      selectedColor === color ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setImageIndex(0);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Role-Based Actions */}
          {role === 'admin' ? (
            <div className="flex gap-4 mt-6">
              <button onClick={handleApproveClick} className="px-4 py-2 bg-green-600 text-white rounded">Approve</button>
              <button onClick={handleRejectClick} className="px-4 py-2 bg-red-600 text-white rounded">Reject</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-2">
                <label className="font-medium">Qty:</label>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
              </div>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded">Favorite</button>
                <button onClick={handleAddToCart} className="px-4 py-2 bg-blue-600 text-white rounded" >Add to Cart</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <RelatedProducts category={category} currentProductId={product._id} /> */}
    </>
  );
};

export default ProductDetail;