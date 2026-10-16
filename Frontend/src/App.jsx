import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Public from './pages/Public'
import Auth from './pages/Auth'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Admin from './pages/Admin'

function Shell({ children }) { return <><Header />{children}</> }
export default function App() { return <BrowserRouter><AuthProvider><CartProvider><Routes>
  <Route path="/" element={<Public />} /><Route path="/login" element={<Auth mode="login" />} /><Route path="/register" element={<Auth mode="register" />} />
  <Route element={<ProtectedRoute />}><Route path="/shop" element={<Shell><Shop /></Shell>} /><Route path="/cart" element={<Shell><Cart /></Shell>} /><Route path="/checkout" element={<Shell><Checkout /></Shell>} /><Route path="/orders" element={<Shell><Orders /></Shell>} /></Route>
  <Route element={<ProtectedRoute role="ADMIN" />}><Route path="/admin" element={<Shell><Admin /></Shell>} /></Route>
</Routes></CartProvider></AuthProvider></BrowserRouter> }
