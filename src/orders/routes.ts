import { Router } from "express";
import Ajv from 'ajv';


import * as OrderController from "./controller";

const router = Router();

router.get("/", async (req, res) => { 
    try {
        const orders = await OrderController.getAllOrders();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching orders", error });
    }
});

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