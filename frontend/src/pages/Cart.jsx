import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPriceDH } from '../utils/formatters'
import './Cart.css'

const Cart = () => {
  const { cartItems, updateCartItem, removeFromCart, getCartTotal } = useCart()
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    const result = await updateCartItem(itemId, newQuantity)
    if (!result.success) {
      setError(result.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleRemove = async (itemId) => {
    const result = await removeFromCart(itemId)
    if (!result.success) {
      setError(result.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits pour commencer vos achats</p>
          <Link to="/" className="btn-primary">
            Voir les produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 className="page-title">Mon Panier</h2>

      {error && <div className="error">{error}</div>}

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <p className="cart-item-price">{formatPriceDH(item.product.price)}</p>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  {formatPriceDH(item.product.price * item.quantity)}
                </div>
                <button 
                  className="btn-remove"
                  onClick={() => handleRemove(item.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Résumé</h3>
          <div className="summary-row">
            <span>Sous-total</span>
            <span>{formatPriceDH(getCartTotal())}</span>
          </div>
          <div className="summary-row">
            <span>Frais de livraison</span>
            <span>{formatPriceDH(30)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPriceDH(getCartTotal() + 30)}</span>
          </div>
          <button className="btn-checkout" onClick={handleCheckout}>
            Passer la commande
          </button>
          <Link to="/" className="btn-continue-shopping">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
