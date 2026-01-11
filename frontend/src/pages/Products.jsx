import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { formatPriceDH } from '../utils/formatters'
import './Products.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/products')
      if (response.data.success) {
        setProducts(response.data.products)
      }
    } catch (error) {
      setError('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1)
    if (result.success) {
      setSuccessMessage(result.message)
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setError(result.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  if (loading) {
    return <div className="loading">Chargement des produits...</div>
  }

  return (
    <div className="container">
      <h2 className="page-title">Nos Produits</h2>
      
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">{formatPriceDH(product.price)}</span>
                <span className="product-stock">
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture de stock'}
                </span>
              </div>
              <button 
                className="btn-add-to-cart"
                onClick={() => handleAddToCart(product.id)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
