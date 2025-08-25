import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import LandingPage from './Pages/LandingPage'
import Cart from './Components/Cart'
import ProtectedRoute from './Components/ProtectedRoutes'
import SellersProduct from './Pages/seller/SellersProduct'
import DashboardLayout from './Layout/DashboardLayout'
import ProductList from './Components/ProductList'
import CreateProduct from './Pages/seller/createProduct'
import ProductOverview from './Components/ProductsOverwiew'
import { ToastContainer } from 'react-toastify'
import Dashboard from './Pages/seller/Dashboard'
import Orders from './Pages/seller/Orders'
// import Users from './Pages/seller/Users'
import NotificationPanel from './Pages/seller/Notifications'
import ProductDetail from './Components/ProductDetail'
import UpdateProduct from './Pages/seller/UpdateProduct'
import { NotificationProvider } from './Context/notificationsContext'
import AdminProduct from './Pages/Admin/AdminProduct'
import MainLayout from './Layout/MainLayOut'
import CategoryPage from './Pages/Category'
import CartPage from './Pages/CartPage'
import Aboutus from './Pages/Aboutus'
import { CartProvider } from './Context/CartContext'
import Users from './Components/Users'
import InventoryForm from './Components/SellersComponent/InventoryForm'
import MyOrders from './Components/myOrder'
import CheckoutPage from './Pages/CheckOutPage'
import OrderDetail from './Components/OrderDetail'
import { AuthProvider } from './Context/AuthContext'
import { ProductProvider } from './Context/ProductContext'
import ProductManagement from './Pages/seller/SellersProduct'

function App() {
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false);
const [showAuth, setShowAuth] = useState(true);
  return (
    <>
    <AuthProvider>
    <CartProvider>
    <NotificationProvider>
    <ProductProvider> {/* ✅ Added ProductProvider here to wrap the Router */}
    <Router>
<Routes>
  {/* Home as public landing page */}
 <Route element={<MainLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
  <Route path="/" element={<Home />} />
 <Route path="/about" element={<Aboutus />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/shop" element={<CategoryPage  />} />
 <Route path="/shop/:category" element={<CategoryPage />} />
  {/*   <Route path="/womens" element={<CategoryPage category="womens" />} />
  <Route path="/kids" element={<CategoryPage category="kids" />} /> */}
   <Route
    path="/Cart"
    element={
      <ProtectedRoute allowedRoles={['buyer']}>
        <CartPage darkMode={darkMode} setDarkMode={setDarkMode}/>
      </ProtectedRoute>
    }
  ></Route> 
   <Route
    path="/my-orders"
    element={
      <ProtectedRoute allowedRoles={['buyer']}>
        <MyOrders darkMode={darkMode} setDarkMode={setDarkMode}/>
      </ProtectedRoute>
    }
  ></Route> 
    <Route path="/checkout" element={<ProtectedRoute allowedRoles={'buyer'}><CheckoutPage/></ProtectedRoute>} />
</Route>


  {/* Auth panel route */}
  <Route path="/landing" element={<LandingPage />} />
  <Route path="/signin" element={<LandingPage showAuth={true} />} />
  {/* Role-protected routes */}
  <Route
    path="/seller-store"
    element={
      <ProtectedRoute allowedRoles={['seller']}>
        <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}/>
      </ProtectedRoute>
    }
  >
    <Route index  element={<Dashboard  darkMode={darkMode} setDarkMode={setDarkMode}/>} />
    <Route path='dashboard'  element={<Dashboard  darkMode={darkMode} setDarkMode={setDarkMode}/>} />
    <Route path='orders/:id'  element={<OrderDetail isSeller={true}  darkMode={darkMode} setDarkMode={setDarkMode}/>} />


    <Route path="orders" element={<Orders darkMode={darkMode}/>} />
    <Route path="users" element={<Users darkMode={darkMode}/>} />
    <Route path="products" element={<ProductManagement isAdmin={false} darkMode={darkMode}/>} />
    <Route path="product/:id" element={<ProductDetail darkMode={darkMode}/>} />
<Route path="inventory/:id" element={<InventoryForm isAdmin={false}/>} />
    <Route path="notifications" element={<NotificationPanel darkMode={darkMode}/>} />
    
    <Route path="create-product" element={<CreateProduct isAdmin={false} darkMode={darkMode}/>} />
    <Route path="products/update-product/:id" element={<UpdateProduct isAdmin={false} darkMode={darkMode}/>} />





  </Route>

  <Route
    path="/admin-dashboard"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}/>
      </ProtectedRoute>
    }
  >
     <Route index  element={<Dashboard  darkMode={darkMode} setDarkMode={setDarkMode}/>} />
    <Route path='dashboard'  element={<Dashboard  darkMode={darkMode} setDarkMode={setDarkMode}/>} />
     <Route path="orders" element={<Orders darkMode={darkMode}/>} />
    <Route path="users" element={<Users darkMode={darkMode}/>} />
    <Route path="products" element={<ProductManagement isAdmin={true} darkMode={darkMode}/>} />
    <Route path="create-product" element={<CreateProduct isAdmin={true} darkMode={darkMode}/>} />
    <Route path="products/update-product/:id" element={<UpdateProduct isAdmin={true} darkMode={darkMode}/>} />

<Route path="inventory/:id" element={<InventoryForm isAdmin={true}/>} />

     <Route path="product/:id" element={<ProductDetail  darkMode={darkMode}/>} />
    <Route path="notifications" element={<NotificationPanel darkMode={darkMode}/>} />
    </Route>

  
  
  
</Routes>

    </Router>
    </ProductProvider>
    </NotificationProvider>
<ToastContainer position="top-center" autoClose={3000} />
    </CartProvider>
    </AuthProvider>
    </>
  )
}

export default App