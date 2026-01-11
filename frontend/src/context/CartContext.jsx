import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    let id = localStorage.getItem('sessionId')
    if (!id) {
      id = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now()
      localStorage.setItem('sessionId', id)
    }
    setSessionId(id)
  }, [])

  useEffect(() => {
    if (sessionId) {
      fetchCart()
    }
  }, [sessionId])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/cart?sessionId=${sessionId}`)
      if (response.data.success) {
        setCartItems(response.data.cartItems)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post('/api/cart', {
        sessionId,
        productId,
        quantity
      })
      if (response.data.success) {
        await fetchCart()
        return { success: true, message: response.data.message }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de l\'ajout au panier' 
      }
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await axios.put(`/api/cart/${itemId}`, { quantity })
      if (response.data.success) {
        await fetchCart()
        return { success: true }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la mise à jour' 
      }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const response = await axios.delete(`/api/cart/${itemId}`)
      if (response.data.success) {
        await fetchCart()
        return { success: true }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la suppression' 
      }
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cartItems,
    loading,
    sessionId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    fetchCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
