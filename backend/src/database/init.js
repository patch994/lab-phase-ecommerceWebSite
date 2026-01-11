require('dotenv').config();
const sequelize = require('./config');
const { Product, CartItem, Order, OrderItem } = require('../models');

const initDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Add sample products
    const sampleProducts = [
      {
        name: 'Smartphone Samsung Galaxy A54',
        description: 'Smartphone dernière génération avec 128GB de stockage',
        price: 3499.00,
        stock: 15,
        image: 'https://via.placeholder.com/300x300?text=Samsung+A54'
      },
      {
        name: 'Laptop HP Pavilion',
        description: 'Ordinateur portable HP avec Intel Core i5 et 8GB RAM',
        price: 6799.00,
        stock: 10,
        image: 'https://via.placeholder.com/300x300?text=HP+Pavilion'
      },
      {
        name: 'Écouteurs Bluetooth Sony',
        description: 'Écouteurs sans fil avec réduction de bruit',
        price: 899.00,
        stock: 25,
        image: 'https://via.placeholder.com/300x300?text=Sony+Headphones'
      },
      {
        name: 'Montre Connectée Xiaomi Band 8',
        description: 'Montre intelligente avec suivi de la santé',
        price: 449.00,
        stock: 30,
        image: 'https://via.placeholder.com/300x300?text=Xiaomi+Band+8'
      },
      {
        name: 'Tablette Samsung Galaxy Tab A9',
        description: 'Tablette 10 pouces avec 64GB de stockage',
        price: 2299.00,
        stock: 12,
        image: 'https://via.placeholder.com/300x300?text=Samsung+Tab'
      }
    ];

    for (const product of sampleProducts) {
      await Product.create(product);
    }

    console.log('Sample products added successfully');
    process.exit(0);

  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

initDatabase();
