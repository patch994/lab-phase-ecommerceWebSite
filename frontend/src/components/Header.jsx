import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Header.css'

const Header = () => {
  const { getCartCount } = useCart()

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>E-commerce Maroc</h1>
        </Link>
        <nav>
          <Link to="/" className="nav-link">Produits</Link>
          <Link to="/cart" className="nav-link cart-link">
            Panier
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
