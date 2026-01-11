import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPriceDH } from '../utils/formatters'
import { moroccanCities } from '../utils/moroccanCities'
import axios from 'axios'
import './Checkout.css'

const Checkout = () => {
  const { cartItems, getCartTotal, sessionId, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const SHIPPING_FEE = 30
  const subtotal = getCartTotal()
  const total = subtotal + SHIPPING_FEE

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    city: '',
    postal_code: '',
    email: ''
  })

  const [formErrors, setFormErrors] = useState({})

  const validatePhone = (phone) => {
    const patterns = [
      /^\+212[5-7]\d{8}$/,
      /^0[5-7]\d{8}$/,
      /^212[5-7]\d{8}$/
    ]
    const cleaned = phone.replace(/\s/g, '')
    return patterns.some(pattern => pattern.test(cleaned))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.customer_name.trim()) {
      errors.customer_name = 'Le nom complet est obligatoire'
    }

    if (!formData.customer_phone.trim()) {
      errors.customer_phone = 'Le numéro de téléphone est obligatoire'
    } else if (!validatePhone(formData.customer_phone)) {
      errors.customer_phone = 'Numéro de téléphone marocain invalide (ex: +212612345678 ou 0612345678)'
    }

    if (!formData.customer_address.trim()) {
      errors.customer_address = 'L\'adresse de livraison est obligatoire'
    }

    if (!formData.city) {
      errors.city = 'La ville est obligatoire'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Adresse email invalide'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setError('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    if (cartItems.length === 0) {
      setError('Votre panier est vide')
      return
    }

    setShowConfirmation(true)
  }

  const confirmOrder = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.post('/api/checkout', {
        ...formData,
        sessionId
      })

      if (response.data.success) {
        clearCart()
        navigate(`/order-confirmation/${response.data.order.id}`, {
          state: { order: response.data.order }
        })
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création de la commande')
      setShowConfirmation(false)
    } finally {
      setLoading(false)
    }
  }

  const cancelConfirmation = () => {
    setShowConfirmation(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits avant de passer commande</p>
          <Link to="/" className="btn-primary">
            Voir les produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 className="page-title">Finaliser la commande</h2>

      {error && <div className="error">{error}</div>}

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h3>Informations de livraison</h3>

              <div className="form-group">
                <label htmlFor="customer_name">
                  Nom complet <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className={formErrors.customer_name ? 'error' : ''}
                  placeholder="Entrez votre nom complet"
                />
                {formErrors.customer_name && (
                  <span className="error-message">{formErrors.customer_name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="customer_phone">
                  Numéro de téléphone <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="customer_phone"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  className={formErrors.customer_phone ? 'error' : ''}
                  placeholder="+212612345678 ou 0612345678"
                />
                {formErrors.customer_phone && (
                  <span className="error-message">{formErrors.customer_phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="customer_address">
                  Adresse de livraison <span className="required">*</span>
                </label>
                <textarea
                  id="customer_address"
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  className={formErrors.customer_address ? 'error' : ''}
                  placeholder="Numéro, rue, quartier..."
                  rows="3"
                />
                {formErrors.customer_address && (
                  <span className="error-message">{formErrors.customer_address}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">
                    Ville <span className="required">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={formErrors.city ? 'error' : ''}
                  >
                    <option value="">Sélectionnez une ville</option>
                    {moroccanCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {formErrors.city && (
                    <span className="error-message">{formErrors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="postal_code">Code postal (optionnel)</label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="Ex: 20000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (optionnel, pour le suivi)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors.email ? 'error' : ''}
                  placeholder="votre@email.com"
                />
                {formErrors.email && (
                  <span className="error-message">{formErrors.email}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Méthode de paiement</h3>
              <div className="payment-method">
                <div className="payment-option selected">
                  <div className="payment-icon">💵</div>
                  <div>
                    <strong>Paiement à la livraison (COD)</strong>
                    <p>Vous paierez au livreur lors de la réception de votre commande</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link to="/cart" className="btn-secondary">
                Retour au panier
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </div>
          </form>
        </div>

        <div className="order-summary-section">
          <div className="order-summary">
            <h3>Résumé de la commande</h3>

            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="order-item-details">
                    <p className="order-item-name">{item.product.name}</p>
                    <p className="order-item-quantity">Quantité: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    {formatPriceDH(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="order-total-row">
                <span>Sous-total</span>
                <span>{formatPriceDH(subtotal)}</span>
              </div>
              <div className="order-total-row">
                <span>Frais de livraison</span>
                <span>{formatPriceDH(SHIPPING_FEE)}</span>
              </div>
              <div className="order-total-row total">
                <span>Total à payer</span>
                <span>{formatPriceDH(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmer votre commande</h3>
            <p>Êtes-vous sûr de vouloir passer cette commande ?</p>
            <div className="modal-details">
              <p><strong>Nom:</strong> {formData.customer_name}</p>
              <p><strong>Téléphone:</strong> {formData.customer_phone}</p>
              <p><strong>Adresse:</strong> {formData.customer_address}, {formData.city}</p>
              <p><strong>Total:</strong> {formatPriceDH(total)}</p>
            </div>
            <div className="modal-actions">
              <button onClick={cancelConfirmation} className="btn-secondary" disabled={loading}>
                Annuler
              </button>
              <button onClick={confirmOrder} className="btn-primary" disabled={loading}>
                {loading ? 'Traitement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
