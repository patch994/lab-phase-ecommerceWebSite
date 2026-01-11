const { CartItem, Product } = require('../models');

const getCart = async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID requis'
      });
    }

    const cartItems = await CartItem.findAll({
      where: { sessionId },
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    return res.json({
      success: true,
      cartItems
    });

  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du panier'
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;

    if (!sessionId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes'
      });
    }

    // Check if product exists and has enough stock
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit introuvable'
      });
    }

    // Check if item already in cart
    let cartItem = await CartItem.findOne({
      where: { sessionId, productId }
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant. Stock disponible: ${product.stock}`
        });
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant. Stock disponible: ${product.stock}`
        });
      }
      cartItem = await CartItem.create({
        sessionId,
        productId,
        quantity
      });
    }

    return res.json({
      success: true,
      message: 'Produit ajouté au panier',
      cartItem
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout au panier'
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(id, {
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Article introuvable dans le panier'
      });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        success: false,
        message: `Stock insuffisant. Stock disponible: ${cartItem.product.stock}`
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.json({
      success: true,
      message: 'Panier mis à jour',
      cartItem
    });

  } catch (error) {
    console.error('Update cart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du panier'
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await CartItem.findByPk(id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Article introuvable dans le panier'
      });
    }

    await cartItem.destroy();

    return res.json({
      success: true,
      message: 'Article retiré du panier'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'article'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
