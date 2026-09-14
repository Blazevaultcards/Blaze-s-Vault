import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import ProductDetail from "@/pages/ProductDetail";
import CartPage from "@/pages/Cart";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Account from "@/pages/Account";
import Sell from "@/pages/Sell";
import About from "@/pages/About";
import { OrderSuccess, OrderCancelled } from "@/pages/OrderResult";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCardForm from "@/pages/admin/AdminCardForm";
import AdminOrders from "@/pages/admin/AdminOrders";
import { RequireAuth, RequireAdmin } from "@/components/ProtectedRoute";
import { BG } from "@/theme";

export default function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse title="Browse All Cards" />} />
        <Route path="/singles" element={<Browse category="singles" title="Singles" />} />
        <Route path="/sealed" element={<Browse category="sealed" title="Sealed Product" />} />
        <Route path="/graded" element={<Browse category="graded" title="Graded Cards" />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/order/cancelled" element={<OrderCancelled />} />

        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/cards/new"
          element={
            <RequireAdmin>
              <AdminCardForm />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/cards/:id"
          element={
            <RequireAdmin>
              <AdminCardForm />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <RequireAdmin>
              <AdminOrders />
            </RequireAdmin>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}
