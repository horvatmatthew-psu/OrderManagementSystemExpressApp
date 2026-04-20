import * as OrderController from '../orders/controller';

// Mock the Order model
jest.mock('../common/models/Order', () => {
  const mockOrder = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
  return jest.fn(() => mockOrder);
});

const mockOrder = require('../common/models/Order')();

describe('Order Controller', () => {
  const mockOrder = require('../common/models/Order')();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should return orders from the model', async () => {
      const mockOrders = [{ id: 1, customerName: 'Test' }];
      mockOrder.findAll.mockResolvedValue(mockOrders);

      const result = await OrderController.getAllOrders();
      expect(result).toEqual(mockOrders);
      expect(mockOrder.findAll).toHaveBeenCalledTimes(1);
    });  

    it('should throw error on failure', async () => {
      mockOrder.findAll.mockRejectedValue(new Error('DB Error'));

      await expect(OrderController.getAllOrders()).rejects.toThrow('Error fetching orders: Error: DB Error');
    });
  });

  describe('getOrderById', () => {
    it('should return the order if found', async () => {
      const mockOrderData = { id: 1, customerName: 'Test' };
      mockOrder.findByPk.mockResolvedValue(mockOrderData);

      const result = await OrderController.getOrderById('1');
      expect(result).toEqual(mockOrderData);
      expect(mockOrder.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return null if not found', async () => {
      mockOrder.findByPk.mockResolvedValue(null);

      const result = await OrderController.getOrderById('1');
      expect(result).toBeNull();
    });
  });

  describe('deleteOrderById', () => {
    it('should delete and return success if found', async () => {
      const mockOrderInstance = { destroy: jest.fn() };
      mockOrder.findByPk.mockResolvedValue(mockOrderInstance);

      const result = await OrderController.deleteOrderById('1');
      expect(result).toEqual({ success: true, message: 'Order deleted successfully' });
      expect(mockOrderInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it('should return not found if order does not exist', async () => {
      mockOrder.findByPk.mockResolvedValue(null);

      const result = await OrderController.deleteOrderById('1');
      expect(result).toEqual({ success: false, message: 'Order not found' });
    });
  });

  describe('patchOrderById', () => {
    it('should update and return success if found', async () => {
      const mockOrderInstance = { update: jest.fn().mockResolvedValue(undefined) };
      mockOrder.findByPk.mockResolvedValue(mockOrderInstance);

      const result = await OrderController.patchOrderById('1', { customerName: 'Updated' });
      expect(result.success).toBe(true);
      expect(result.data).toBe(mockOrderInstance);
      expect(mockOrderInstance.update).toHaveBeenCalledWith({ customerName: 'Updated' });
    });

    it('should return not found if order does not exist', async () => {
      mockOrder.findByPk.mockResolvedValue(null);

      const result = await OrderController.patchOrderById('1', { customerName: 'Updated' });
      expect(result).toEqual({ success: false, message: 'Order not found' });
    });
  });

  describe('addNewOrder', () => {
    it('should create a new order', async () => {
      const mockNewOrder = { customerName: 'New', totalAmount: 100 };
      mockOrder.create.mockResolvedValue(mockNewOrder);

      // Mock setTimeout to resolve immediately for testing
      jest.useFakeTimers();
      const promise = OrderController.addNewOrder('New', 100);
      jest.runOnlyPendingTimers();
      await promise;

      expect(mockOrder.create).toHaveBeenCalledWith({
        customerName: 'New',
        totalAmount: 100,
        orderDate: expect.any(Date),
        status: 'Pending'
      });
      jest.useRealTimers();
    });

    it('should throw error if customer name is missing', async () => {
      await expect(OrderController.addNewOrder('', 100)).rejects.toThrow('Error creating new order: Error: Customer name is required');
    });

    it('should throw error if customer name is only whitespace', async () => {
      await expect(OrderController.addNewOrder('   ', 100)).rejects.toThrow('Error creating new order: Error: Customer name is required');
    });
  });

 
});