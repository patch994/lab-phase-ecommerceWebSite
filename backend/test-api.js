const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('Testing E-commerce API...\n');

  try {
    // Test 1: Get products
    console.log('1. Testing GET /api/products');
    const productsRes = await axios.get(`${BASE_URL}/products`);
    console.log(`✓ Success: Found ${productsRes.data.products.length} products\n`);

    // Test 2: Add to cart
    console.log('2. Testing POST /api/cart');
    const sessionId = 'test_' + Date.now();
    const cartRes = await axios.post(`${BASE_URL}/cart`, {
      sessionId,
      productId: 1,
      quantity: 2
    });
    console.log(`✓ Success: Added product to cart\n`);

    // Test 3: Get cart
    console.log('3. Testing GET /api/cart');
    const getCartRes = await axios.get(`${BASE_URL}/cart?sessionId=${sessionId}`);
    console.log(`✓ Success: Cart has ${getCartRes.data.cartItems.length} items\n`);

    // Test 4: Create order
    console.log('4. Testing POST /api/checkout');
    const orderRes = await axios.post(`${BASE_URL}/checkout`, {
      customer_name: 'Ahmed Test',
      customer_phone: '+212612345678',
      customer_address: '123 Rue Test',
      city: 'Casablanca',
      postal_code: '20000',
      email: 'test@example.com',
      sessionId
    });
    console.log(`✓ Success: Order created with number ${orderRes.data.order.orderNumber}\n`);

    // Test 5: Get order
    console.log('5. Testing GET /api/checkout/order/:id');
    const getOrderRes = await axios.get(`${BASE_URL}/checkout/order/${orderRes.data.order.id}`);
    console.log(`✓ Success: Retrieved order ${getOrderRes.data.order.orderNumber}\n`);

    console.log('All tests passed! ✓\n');

  } catch (error) {
    console.error('✗ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAPI();
