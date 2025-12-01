import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    id: null,
    name: '',
    price: '',
    description: '',
    stockQty: '',
    imageUrls: '', // comma-separated URLs for one or more images
    isActive: true,
  })

  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  const user = userRaw ? JSON.parse(userRaw) : null

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError('Please login as admin to manage products.')
      return
    }
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/api/products/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProducts(res.data)
      setError('')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleEdit(product) {
    setForm({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description || '',
      stockQty: product.stockQty ?? '',
      // join existing image URLs into a comma-separated string for editing
      imageUrls: Array.isArray(product.images) ? product.images.join(', ') : '',
      isActive: product.isActive,
    })
  }

  function resetForm() {
    setForm({ id: null, name: '', price: '', description: '', stockQty: '', imageUrls: '', isActive: true })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.price) return

    const images = form.imageUrls
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean)

    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      stockQty: form.stockQty === '' ? 0 : Number(form.stockQty),
      images,
      isActive: form.isActive,
    }

    try {
      if (form.id) {
        await axios.put(`${API_BASE}/api/products/${form.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post(`${API_BASE}/api/products`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      resetForm()
      await fetchProducts()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to save product')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to deactivate this product? It will no longer be visible to customers.')) return
    try {
      const res = await axios.delete(`${API_BASE}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log('Product deleted:', res.data)
      await fetchProducts()
      setError('') // Clear any previous errors
    } catch (err) {
      console.error('Delete error:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      setError(err.response?.data?.message || 'Failed to delete product. Please try again.')
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-wrapper">
        <div className="error" style={{ textAlign: 'center', padding: '3rem' }}>
          Only admin users can access this page.
        </div>
      </div>
    )
  }

  return (
    <div className="admin-wrapper">
      <h2>Admin: Manage Products</h2>
      {error && <div className="error-text" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{form.id ? 'Edit product' : 'Add new product'}</h3>
        <div className="admin-form-row">
          <label className="field-label">
            Name
            <input name="name" value={form.name} onChange={handleChange} required className="admin-input" />
          </label>
          <label className="field-label">
            Price (Rs.)
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </label>
        </div>
        <div className="admin-form-row">
          <label className="admin-full field-label">
            Description
            <textarea
              name="description"
              rows="2"
              value={form.description}
              onChange={handleChange}
              className="admin-input"
            />
          </label>
        </div>
        <div className="admin-form-row">
          <label className="field-label">
            Stock qty
            <input
              name="stockQty"
              type="number"
              min="0"
              value={form.stockQty}
              onChange={handleChange}
              className="admin-input"
            />
          </label>
          <label className="admin-full field-label">
            Image URL(s)
            <input
              name="imageUrls"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              value={form.imageUrls}
              onChange={handleChange}
              className="admin-input"
            />
          </label>
          <label className="admin-checkbox field-label">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            Active
          </label>
        </div>
        <div className="admin-form-actions">
          <button type="submit">{form.id ? 'Update product' : 'Add product'}</button>
          {form.id && (
            <button type="button" onClick={resetForm} className="secondary-btn">
              Cancel edit
            </button>
          )}
        </div>
      </form>

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                No products found. Add your first product above.
              </p>
            ) : (
              <>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price (Rs.)</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id}>
                          <td>{p.name}</td>
                          <td>{p.description || '-'}</td>
                          <td>{p.price}</td>
                          <td>{p.stockQty ?? '-'}</td>
                          <td>{p.isActive ? 'Active' : 'Inactive'}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleEdit(p)}
                              className="primary-btn"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="danger-btn"
                              onClick={() => handleDelete(p._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="admin-mobile-list">
                  {products.map((p) => (
                    <div key={p._id} className="admin-mobile-card">
                      <div className="admin-mobile-card-header">
                        <h3 className="admin-mobile-card-title">{p.name}</h3>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: p.isActive ? '#d1fae5' : '#fee2e2',
                            color: p.isActive ? '#065f46' : '#991b1b',
                          }}
                        >
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="admin-mobile-card-field">
                        <div className="admin-mobile-card-field-label">Description</div>
                        <div className="admin-mobile-card-field-value">
                          {p.description || '-'}
                        </div>
                      </div>
                      <div className="admin-mobile-card-field">
                        <div className="admin-mobile-card-field-label">Price</div>
                        <div className="admin-mobile-card-field-value">Rs. {p.price}</div>
                      </div>
                      <div className="admin-mobile-card-field">
                        <div className="admin-mobile-card-field-label">Stock</div>
                        <div className="admin-mobile-card-field-value">
                          {p.stockQty ?? '-'}
                        </div>
                      </div>
                      <div className="admin-mobile-card-actions">
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
                          className="primary-btn"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger-btn"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
    </div>
  )
}
