import { Router } from "express";
import Ajv from 'ajv';


import * as OrderController from "./controller";

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Gets list of all orders.
 *     description: Gets a list of all orders..
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */
router.get("/", async (req, res) => { 
    try {
        const orders = await OrderController.getAllOrders();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching orders", error });
    }
});

 /**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with customer name and total amount
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - totalAmount
 *             properties:
 *               customerName:
 *                 type: string
 *                 minLength: 3
 *                 description: Name of the customer
 *               totalAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: Total amount of the order
 *     responses:
 *       '201':
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '400':
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */
router.post("/", async (req, res) => {
    const { customerName, totalAmount } = req.body;
    const ajv = new Ajv();
    const schema = {
        type: 'object',
        required: ['customerName', 'totalAmount'],
        properties: {
        customerName: { type: 'string', minLength: 3 },
        totalAmount: { type: 'number', minimum: 0 }
    }
};
const validate = ajv.compile(schema);
if (!validate(req.body)) {
  return res.status(400).json({ error: 'Invalid order detail', details: validate.errors });
}
   
    try {
        const newOrder = await OrderController.addNewOrder(customerName, totalAmount);
        res.status(201).json({ success: true, message: "Order created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating order", error });
    }
});

 /**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieves a specific order by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       '200':
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const order = await OrderController.getOrderById(id);
        if (order) {
            res.status(200).json({ success: true, data: order });
        } else {
            res.status(404).json({ success: false, message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching order", error });
    }
});

 /**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete order by ID
 *     description: Deletes a specific order by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       '204':
 *         description: Order deleted successfully
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await OrderController.deleteOrderById(id);
        if (result.success) {
            res.status(204).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting order", error });
    }
});

 /**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Update order by ID
 *     description: Partially updates a specific order by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *                 minLength: 3
 *                 description: Name of the customer
 *               totalAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: Total amount of the order
 *     responses:
 *       '200':
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const result = await OrderController.patchOrderById(id, updateData);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating order", error });
    }
});

export default router;