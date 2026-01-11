import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { formatPriceDH } from '../utils/formatters'
import './OrderConfirmation.css'

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!order)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!order) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/checkout/order/${orderId}`)
      if (response.data.success) {
        setOrder(response.data.order)
      }
    } catch (error) {
      setError('Erreur lors de la récupération de la commande')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  if (error || !order) {
    return (
      <div className="container">
        <div className="error">{error || 'Commande introuvable'}</div>
        <Link to="/" className="btn-primary">Retour au catalogue</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Commande confirmée !</h1>
          <p className="confirmation-message">
            Merci pour votre commande. Notre équipe vous contactera par téléphone pour confirmer les détails.
          </p>
        </div>

        <div className="confirmation-details">
          <div className="detail-section">
            <h2>Informations de commande</h2>
            <div className="detail-row">
              <span className="detail-label">Numéro de commande:</span>
              <span className="detail-value order-number">{order.orderNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Statut:</span>
              <span className="detail-value status-badge">En attente</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Méthode de paiement:</span>
              <span className="detail-value">Paiement à la livraison (COD)</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Informations de livraison</h2>
            <div className="detail-row">
              <span className="detail-label">Nom:</span>
              <span className="detail-value">{order.customerName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Téléphone:</span>
              <span className="detail-value">{order.customerPhone}</span>
            </div>
            {order.customerEmail && (
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{order.customerEmail}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Adresse:</span>
              <span className="detail-value">
                {order.customerAddress}
                <br />
                {order.city}
                {order.postalCode && `, ${order.postalCode}`}
              </span>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="detail-section">
              <h2>Articles commandés</h2>
              <div className="order-items-list">
                {order.items.map(item => (
                  <div key={item.id} className="confirmation-item">
                    {item.product && (
                      <img src={item.product.image} alt={item.productName} />
                    )}
                    <div className="confirmation-item-details">
                      <p className="confirmation-item-name">{item.productName}</p>
                      <p className="confirmation-item-info">
                        Quantité: {item.quantity} × {formatPriceDH(item.unitPrice)}
                      </p>
                    </div>
                    <div className="confirmation-item-price">
                      {formatPriceDH(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section totals-section">
            <h2>Résumé du paiement</h2>
            <div className="totals-grid">
              <div className="total-row">
                <span>Sous-total:</span>
                <span>{formatPriceDH(order.subtotal)}</span>
              </div>
              {parseFloat(order.tax) > 0 && (
                <div className="total-row">
                  <span>Taxes:</span>
                  <span>{formatPriceDH(order.tax)}</span>
                </div>
              )}
              <div className="total-row">
                <span>Frais de livraison:</span>
                <span>{formatPriceDH(order.shippingFee)}</span>
              </div>
              <div className="total-row final-total">
                <span>Total à payer au livreur:</span>
                <span>{formatPriceDH(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="info-box">
            <h3>📞 Prochaines étapes</h3>
            <ul>
              <li>Notre équipe vous contactera dans les prochaines heures pour confirmer votre commande</li>
              <li>Nous vérifierons votre adresse de livraison et les détails de la commande</li>
              <li>Une fois confirmée, votre commande sera préparée et expédiée</li>
              <li>Vous paierez le montant de <strong>{formatPriceDH(order.total)}</strong> au livreur</li>
            </ul>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/" className="btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
