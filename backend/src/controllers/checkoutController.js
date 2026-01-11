const { Order, OrderItem, CartItem, Product } = require('../models');
const { validateMoroccanPhone, formatMoroccanPhone } = require('../utils/validators');
const { generateOrderNumber } = require('../utils/orderNumber');
const sequelize = require('../database/config');

const SHIPPING_FEE = parseFloat(process.env.SHIPPING_FEE || 30);
const TAX_RATE = parseFloat(process.env.TAX_RATE || 0);

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      customer_name,
      customer_phone,
      customer_address,
      city,
      postal_code,
      email,
      sessionId
    } = req.body;

    // Validation
    if (!customer_name || !customer_phone || !customer_address || !city) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires'
      });
    }

    // Validate Moroccan phone number
    if (!validateMoroccanPhone(customer_phone)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Numéro de téléphone marocain invalide. Format attendu: +212XXXXXXXXX ou 0XXXXXXXXX'
      });
    }

    // Get cart items
    const cartItems = await CartItem.findAll({
      where: { sessionId },
      include: [{
        model: Product,
        as: 'product'
      }],
      transaction
    });

    if (!cartItems || cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Votre panier est vide'
      });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (!item.product) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Produit introuvable`
        });
      }

      if (item.product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${item.product.name}. Stock disponible: ${item.product.stock}`
        });
      }
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += parseFloat(item.product.price) * item.quantity;
    }

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + SHIPPING_FEE;

    // Create order
    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      customerName: customer_name,
      customerPhone: formatMoroccanPhone(customer_phone),
      customerEmail: email || null,
      customerAddress: customer_address,
      city,
      postalCode: postal_code || null,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shippingFee: SHIPPING_FEE.toFixed(2),
      total: total.toFixed(2),
      status: 'pending',
      paymentMethod: 'COD'
    }, { transaction });

    // Create order items and update stock
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: (parseFloat(item.product.price) * item.quantity).toFixed(2)
      }, { transaction });

      // Update product stock
      await item.product.update({
        stock: item.product.stock - item.quantity
      }, { transaction });
    }

    // Clear cart
    await CartItem.destroy({
      where: { sessionId },
      transaction
    });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        city: order.city
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Checkout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande'
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    return res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande'
    });
  }
};

module.exports = {
  createOrder,
  getOrder
};
