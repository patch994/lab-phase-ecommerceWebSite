const { Product } = require('../models');

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        stock: {
          [require('sequelize').Op.gt]: 0
        }
      }
    });

    return res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits'
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit introuvable'
      });
    }

    return res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit'
    });
  }
};

module.exports = {
  getProducts,
  getProduct
};
