import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import Navbar from "./components/common/Navbar";
import PrivateRoute from "./PrivateRoute";
import ProductList from "./components/product/ProductList";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Footer from "./components/common/Footer";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import Help from "./pages/Help";
import Products from "./pages/Products";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import EditProduct from "./pages/admin/EditProduct";
import ProductDetails from "./components/product/ProductDetails";
import { WishlistProvider } from "./context/WishlistContext";
import AdminUsers from "./pages/admin/AdminUsers";
import CategoryPage from "./pages/CategoryPage";
import Profile from "./pages/Profile";
import AdminSidebar from "./components/admin/AdminSidebar";
import ManageInquiries from "./pages/admin/ManageInquiries";
import DeliveryAssign from "./pages/admin/AdminAssignRow";
import DeliveryLayout from "./components/Delivery/DeliveryLayout";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryHistory from "./components/Delivery/DeliveryHistory";
import DeliveryProfile from "./components/Delivery/DeliveryProfile";
import DeliveryManagement from "./pages/admin/DeliveryManagement";

function App() {
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);

  const toggleAdminSidebar = () => {
    setIsAdminSidebarOpen((prev) => !prev);
  };
  const DeliveryRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  return userInfo && userInfo.role === 'delivery' ? children : <Navigate to="/login" />;
};
  return (
    <Router>
      {/* <AuthProvider> */}
      <CartProvider>
         <WishlistProvider>
<div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar 
            onToggleAdminSidebar={toggleAdminSidebar} 
            isAdminSidebarOpen={isAdminSidebarOpen} 
          />
          
          <AdminSidebar 
            isOpen={isAdminSidebarOpen} 
            onClose={() => setIsAdminSidebarOpen(false)} 
          />

<main className="flex-grow mt-[88px] md:mt-[112px]">
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />

        {/* Delivery Routes Wrapped in Layout */}
        <Route path="/delivery" element={<DeliveryLayout />}>
          <Route index element={<DeliveryDashboard />} /> {/* /delivery */}
          <Route path="history" element={<DeliveryHistory />} /> {/* /delivery/history */}
          <Route path="profile" element={<DeliveryProfile />} /> {/* /delivery/profile */}
        </Route>

        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/orders" element={<ManageOrders/>} />
        <Route path="/admin/users" element={<AdminUsers/>} />
        <Route path="/admin/inquiries" element={<ManageInquiries/>} />
        <Route path="/admin/delivery" element={<DeliveryAssign/>} />
        <Route path="/admin/deliverymanage" element={<DeliveryManagement/>} />
        <Route path="/product/:id" element={<ProductDetails/>} />
        <Route path="/order/:id" element={<OrderDetails/>} />
<Route path="/category/:categoryName" element={<CategoryPage />} />
<Route path="/profile" element={<Profile />} />
        {/* <Route path="/admin/products/edit/:id" element={<EditProduct/>} /> */}
{/* <Route
  path="/admin/products"
  element={userInfo?.role==="admin" ? <ManageProducts /> : <Navigate to="/" />}
/> */}
        {/* Protected User Routes */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
  path="/admin/add-product"
  element={
    <PrivateRoute adminOnly={true}>
      <AdminAddProduct />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/products/edit/:id"
  element={
    <PrivateRoute adminOnly={true}>
      <EditProduct />
    </PrivateRoute>
  }
/>

      </Routes>
      </main>
      <Footer/>
      </div>
               </WishlistProvider>

      </CartProvider>
      {/* </AuthProvider> */}
    </Router>
  );
}

export default App;
