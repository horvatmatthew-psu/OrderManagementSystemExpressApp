import request from 'supertest';
import sequelize from '../common/database';
import app from '../app';


describe('Orders API', () => {
  beforeEach(async () => {
    // Sync the database for each test to reset data
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection after all tests
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

  describe('GET /orders/:id', () => {
    it('should return an order by ID', async () => {
      // First create an order
      await request(app)
        .post('/orders')
        .send({
          customerName: 'Alice Smith',
          totalAmount: 150.00
        });

      // Then get the order by ID (assuming it's the first order, ID=1)
      const response = await request(app)
        .get('/orders/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('customerName', 'Alice Smith');
      expect(response.body.data).toHaveProperty('totalAmount', 150.00);
    });

    it('should return 404 for non-existing order', async () => {
      const response = await request(app)
        .get('/orders/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message', 'Order not found');
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete an order by ID', async () => {
      // First create an order
      await request(app)
        .post('/orders')
        .send({
          customerName: 'Bob Johnson',
          totalAmount: 300.00
        });

      // Then delete the order by ID (assuming ID=1)
      const response = await request(app)
        .delete('/orders/1')
        .expect(204);

      // Optionally, verify it's deleted by trying to get it
      const getResponse = await request(app)
        .get('/orders/1')
        .expect(404);
    });

    it('should return 404 for deleting non-existing order', async () => {
      const response = await request(app)
        .delete('/orders/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message', 'Order not found');
    });
  });

  describe('PATCH /orders/:id', () => {
    it('should update an order by ID', async () => {
      // First create an order
      await request(app)
        .post('/orders')
        .send({
          customerName: 'Charlie Brown',
          totalAmount: 250.00
        });

      // Then update the order by ID (assuming ID=1)
      const response = await request(app)
        .patch('/orders/1')
        .send({
            status: 'Completed'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('status', 'Completed');
    });

    it('should return 404 for updating non-existing order', async () => {
      const response = await request(app)
        .patch('/orders/999')
        .send({
          customerName: 'Non-existing'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message', 'Order not found');
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