import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import {
  Products,
  ProductDetail,
  CartPage,
  LoginPage,
  RegisterPage,
  CheckoutPage,
  OrderSuccessPage,
  OrderFailurePage,
} from './pages/Products'
import TestPayment from './pages/TestPayment'
import AdminProducts from './pages/AdminProducts'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:idOrSlug" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/test" element={<TestPayment />} />
        <Route path="/payment/success" element={<OrderSuccessPage />} />
        <Route path="/payment/failure" element={<OrderFailurePage />} />

        <Route path="/admin/products" element={<AdminProducts />} />
      </Route>
    </Routes>
  )
}

export default App
