import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  // Initialize cart from localStorage immediately to prevent flash of empty cart
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Validate cart structure
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          return parsedCart
        }
      }
    } catch (err) {
      console.error('Error loading cart from localStorage', err)
      localStorage.removeItem('cart')
    }
    return []
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch (err) {
      console.error('Error saving cart to localStorage', err)
    }
  }, [cart])

  function addToCart(product, quantity = 1) {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product._id === product._id)

      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        return [...prevCart, { product, quantity }]
      }
    })
  }

  function removeFromCart(productId) {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId))
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    )
  }

  function clearCart() {
    setCart([])
  }

  function getCartTotal() {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
