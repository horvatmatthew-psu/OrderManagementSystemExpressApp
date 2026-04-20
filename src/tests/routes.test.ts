import request from 'supertest';
import app from '../app';

// Mock the OrderController
jest.mock('../orders/controller', () => ({
  getAllOrders: jest.fn(),
  addNewOrder: jest.fn(),
  getOrderById: jest.fn(),
  deleteOrderById: jest.fn(),
  patchOrderById: jest.fn(),
}));

const OrderController = require('../orders/controller');

describe('Orders API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('should return a list of orders', async () => {
      OrderController.getAllOrders.mockResolvedValue([]);

      const response = await request(app)
        .get('/orders')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(OrderController.getAllOrders).toHaveBeenCalledTimes(1);
    });

    it('should return orders after creating one', async () => {
      OrderController.addNewOrder.mockResolvedValue(undefined);
      OrderController.getAllOrders.mockResolvedValue([
        { id: 1, customerName: 'Jane Doe', totalAmount: 200.00, orderDate: new Date(), status: 'Pending' }
      ]);

      // Simulate creating an order
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
      expect(OrderController.addNewOrder).toHaveBeenCalledWith('Jane Doe', 200.00);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return an order by ID', async () => {
      const mockOrder = { id: 1, customerName: 'Alice Smith', totalAmount: 150.00 };
      OrderController.getOrderById.mockResolvedValue(mockOrder);

      const response = await request(app)
        .get('/orders/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('customerName', 'Alice Smith');
      expect(response.body.data).toHaveProperty('totalAmount', 150.00);
      expect(OrderController.getOrderById).toHaveBeenCalledWith('1');
    });

    it('should return 404 for non-existing order', async () => {
      OrderController.getOrderById.mockResolvedValue(null);

      const response = await request(app)
        .get('/orders/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message', 'Order not found');
      expect(OrderController.getOrderById).toHaveBeenCalledWith('999');
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete an order by ID', async () => {
      OrderController.deleteOrderById.mockResolvedValue({ success: true, message: 'Order deleted successfully' });

      const response = await request(app)
        .delete('/orders/1')
        .expect(204);

      expect(OrderController.deleteOrderById).toHaveBeenCalledWith('1');
    });

    it('should return 404 for deleting non-existing order', async () => {
      OrderController.deleteOrderById.mockResolvedValue({ success: false, message: 'Order not found' });

      const response = await request(app)
        .delete('/orders/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message', 'Order not found');
      expect(OrderController.deleteOrderById).toHaveBeenCalledWith('999');
    });
  });

  describe('PATCH /orders/:id', () => {
    it('should update an order by ID', async () => {
      const mockUpdatedOrder = { id: 1, customerName: 'Charlie Brown', totalAmount: 250.00, status: 'Completed' };
      OrderController.patchOrderById.mockResolvedValue({ success: true, data: mockUpdatedOrder });

      const response = await request(app)
        .patch('/orders/1')
        .send({
          status: 'Completed'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('status', 'Completed');
      expect(OrderController.patchOrderById).toHaveBeenCalledWith('1', { status: 'Completed' });
    });

    it('should return 404 for updating non-existing order', async () => {
      OrderController.patchOrderById.mockResolvedValue({ success: false, message: 'Order not found' });

      const response = await request(app)
        .patch('/orders/999')
        .send({
          customerName: 'Non-existing'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message', 'Order not found');
      expect(OrderController.patchOrderById).toHaveBeenCalledWith('999', { customerName: 'Non-existing' });
    });
  });

  describe('POST /orders', () => {
    it('should create a new order with valid data', async () => {
      OrderController.addNewOrder.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/orders')
        .send({
          customerName: 'John Doe',
          totalAmount: 100.50
        })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Order created successfully');
      expect(OrderController.addNewOrder).toHaveBeenCalledWith('John Doe', 100.50);
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerName: 'Jo',
          totalAmount: -10
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      // Note: AJV validation doesn't use the controller, so no mock call
    });

    it('should return 400 for invalid data type', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerName: 'John Doe',
          totalAmount: 'invalid_amount'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      // AJV validation
    });
  });
});