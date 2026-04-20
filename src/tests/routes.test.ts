import request from 'supertest';
import sequelize from '../common/database';
import app from '../app';


describe('Orders API', () => {
  beforeAll(async () => {
    // Sync the database for tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  describe('GET /orders', () => {
    it('should return a list of orders', async () => {
      const response = await request(app)
        .get('/orders')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return orders after creating one', async () => {
      // First create an order
      await request(app)
        .post('/orders')
        .send({
          customerName: 'Jane Doe',
          totalAmount: 200.00
        });

      // Then get orders
      const response = await request(app)
        .get('/orders')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('customerName', 'Jane Doe');
      expect(response.body.data[0]).toHaveProperty('totalAmount', 200.00);
    });
  });

  describe('POST /orders', () => {
    it('should create a new order with valid data', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerName: 'John Doe',
          totalAmount: 100.50
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Order created successfully');
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerName: 'Jo',
          totalAmount: -10
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });

    it('should return 400 for invalid data type', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerName: 'John Doe',
          totalAmount: 'invalid_amount'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });
  });
});