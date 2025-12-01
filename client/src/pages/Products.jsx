import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { API_BASE } from '../config/api'

// Products List Page
export function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/api/products`)
      setProducts(res.data)
    } catch (err) {
      console.error('Error fetching products', err)
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart(product) {
    addToCart(product, 1)
    alert(`${product.name} added to cart!`)
  }

  if (loading) {
    return <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>Loading products...</div>
  }

  return (
    <div id="products" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Our Products</h2>
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>No products available.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map((product) => (
            <div key={product._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    console.warn('Failed to load product image:', product.images[0])
                    e.target.style.display = 'none'
                    e.target.parentElement.style.backgroundColor = '#f3f4f6'
                    e.target.parentElement.style.display = 'flex'
                    e.target.parentElement.style.alignItems = 'center'
                    e.target.parentElement.style.justifyContent = 'center'
                    e.target.parentElement.innerHTML = '<span style="color: #9ca3af;">No Image</span>'
                  }}
                />
              )}
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>
                  <Link to={`/products/${product.slug || product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {product.name}
                  </Link>
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                  {product.description || 'No description'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1d4ed8' }}>
                    Rs. {product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="primary-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Product Detail Page
export function ProductDetail() {
  const { idOrSlug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProduct()
  }, [idOrSlug])

  async function fetchProduct() {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/api/products/${idOrSlug}`)
      setProduct(res.data)
    } catch (err) {
      console.error('Error fetching product', err)
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart() {
    if (product) {
      addToCart(product, quantity)
      alert(`${quantity} x ${product.name} added to cart!`)
    }
  }

  if (loading) {
    return <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>Loading product...</div>
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Product not found.</div>
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate('/products')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
        ← Back to Products
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
        <div>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: '100%', borderRadius: '8px' }}
              onError={(e) => {
                console.warn('Failed to load product image:', product.images[0])
                e.target.style.display = 'none'
                const parent = e.target.parentElement
                parent.innerHTML = '<div style="width: 100%; height: 400px; backgroundColor: #f3f4f6; borderRadius: 8px; display: flex; alignItems: center; justifyContent: center;"><span style="color: #9ca3af;">No Image Available</span></div>'
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '400px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              No Image
            </div>
          )}
        </div>
        <div>
          <h1 style={{ marginTop: 0 }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d4ed8', margin: '1rem 0' }}>
            Rs. {product.price}
          </p>
          <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '2rem' }}>
            {product.description || 'No description available.'}
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={{ padding: '0.5rem', width: '100px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <button onClick={handleAddToCart} className="primary-btn" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// Cart Page
export function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Add some products to get started!</p>
        <Link to="/products" className="primary-btn">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Shopping Cart</h2>
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
        {cart.map((item) => (
          <div
            key={item.product._id}
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          >
            {item.product.images && item.product.images.length > 0 ? (
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                onError={(e) => {
                  console.warn('Failed to load cart item image:', item.product.images[0])
                  e.target.style.display = 'none'
                  const parent = e.target.parentElement
                  if (!parent.querySelector('.image-placeholder')) {
                    const placeholder = document.createElement('div')
                    placeholder.className = 'image-placeholder'
                    placeholder.style.width = '100px'
                    placeholder.style.height = '100px'
                    placeholder.style.backgroundColor = '#f3f4f6'
                    placeholder.style.borderRadius = '4px'
                    placeholder.style.display = 'flex'
                    placeholder.style.alignItems = 'center'
                    placeholder.style.justifyContent = 'center'
                    placeholder.style.fontSize = '0.75rem'
                    placeholder.style.color = '#9ca3af'
                    placeholder.textContent = 'No Image'
                    parent.insertBefore(placeholder, e.target)
                  }
                }}
              />
            ) : (
              <div style={{ width: '100px', height: '100px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
                No Image
              </div>
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.product.name}</h3>
              <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>Rs. {item.product.price} each</p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label>
                  Qty:
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                    style={{ marginLeft: '0.5rem', padding: '0.25rem', width: '60px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </label>
                <span style={{ fontWeight: 'bold' }}>Rs. {item.product.price * item.quantity}</span>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Total: Rs. {getCartTotal()}</h3>
          <button onClick={clearCart} style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Clear Cart
          </button>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="primary-btn"
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

// Login Page
export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
      window.location.reload()
    } catch (err) {
      console.error('Login error:', err)
      if (err.response) {
        setError(err.response.data?.message || 'Login failed')
      } else if (err.request) {
        setError('Cannot connect to server. Please check if the backend is running and CORS is configured correctly.')
      } else {
        setError(err.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue shopping and manage your orders.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h3>Sign In</h3>
          {error && <div className="error-text">{error}</div>}
          <label>
            <span className="field-label">Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            <span className="field-label">Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

// Register Page
export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
      window.location.reload()
    } catch (err) {
      console.error('Registration error:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        request: err.request,
        config: { url: err.config?.url, baseURL: err.config?.baseURL }
      })
      
      if (err.response) {
        // Server responded with error
        const errorMsg = err.response.data?.message || `Registration failed (${err.response.status})`
        setError(errorMsg)
      } else if (err.request) {
        // Request made but no response (network/CORS issue)
        const apiUrl = API_BASE || 'backend server'
        setError(`Cannot connect to ${apiUrl}. Check if backend is running and CORS is configured. Check browser console for details.`)
      } else {
        // Something else happened
        setError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <h2>Join HamroShop</h2>
          <p>Create an account to start shopping and enjoy exclusive deals and offers.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          {error && <div className="error-text">{error}</div>}
          <label>
            <span className="field-label">Full Name</span>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            <span className="field-label">Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            <span className="field-label">Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength="6" />
          </label>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

// Checkout Page
export function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart')
    }
  }, [cart, navigate])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const items = cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const orderRes = await axios.post(
        `${API_BASE}/api/orders`,
        {
          items,
          customerInfo: form,
          total: getCartTotal(),
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      )

      const orderId = orderRes.data.order._id

      // Initiate payment
      const paymentRes = await axios.post(`${API_BASE}/api/payments/esewa/initiate`, {
        orderId,
        amount: getCartTotal(),
      })

      console.log('Payment response:', paymentRes.data)

      if (paymentRes.data.testMode) {
        // Test mode - redirect to test payment page
        if (!paymentRes.data.paymentUrl) {
          throw new Error('Test payment URL not provided by server')
        }
        window.location.href = paymentRes.data.paymentUrl
      } else {
        // Real eSewa - submit form
        if (!paymentRes.data.paymentUrl) {
          console.error('Payment URL missing:', paymentRes.data)
          throw new Error('Payment gateway URL not configured. Please contact administrator.')
        }
        
        if (!paymentRes.data.formData) {
          console.error('Form data missing:', paymentRes.data)
          throw new Error('Payment form data not provided by server')
        }

        console.log('Submitting payment form to:', paymentRes.data.paymentUrl)
        console.log('Form data:', paymentRes.data.formData)

        const paymentForm = document.createElement('form')
        paymentForm.method = 'POST'
        paymentForm.action = paymentRes.data.paymentUrl
        paymentForm.style.display = 'none'
        paymentForm.target = '_self' // Submit in same window

        Object.entries(paymentRes.data.formData).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = String(value)
          paymentForm.appendChild(input)
        })

        document.body.appendChild(paymentForm)
        
        // Submit form after a brief delay to ensure it's in the DOM
        setTimeout(() => {
          try {
            paymentForm.submit()
          } catch (submitErr) {
            console.error('Form submission error:', submitErr)
            throw new Error('Failed to submit payment form. Please try again.')
          }
        }, 100)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        request: err.request
      })
      
      let errorMessage = 'Checkout failed. Please try again.'
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || `Checkout failed (${err.response.status})`
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to payment server. Please check your connection and try again.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return null
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Checkout</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            {cart.map((item) => (
              <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{item.product.name} x {item.quantity}</span>
                <span>Rs. {item.product.price * item.quantity}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>Rs. {getCartTotal()}</span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1rem' }}>Customer Information</h3>
          {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span className="field-label">Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span className="field-label">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span className="field-label">Phone</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span className="field-label">Address</span>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows="4"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </label>
          <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Order Success Page
export function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('oid')
  const navigate = useNavigate()
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
      <h2>Order Successful!</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Thank you for your order. {orderId && `Order ID: ${orderId}`}
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => navigate('/products')} className="primary-btn">
          Continue Shopping
        </button>
        {orderId && (
          <button onClick={() => navigate(`/orders/${orderId}`)} className="secondary-btn">
            View Order
          </button>
        )}
      </div>
    </div>
  )
}

// Order Failure Page
export function OrderFailurePage() {
  const navigate = useNavigate()

  return (
    <div className="order-failure" style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
      <h2>Payment Failed</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Payment failed or cancelled. Please try again.</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => navigate('/cart')} className="primary-btn">
          Back to Cart
        </button>
        <button onClick={() => navigate('/products')} className="secondary-btn">
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
