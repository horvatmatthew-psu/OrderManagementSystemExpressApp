import { Router } from "express";
import * as OrderController from "./controller";

const router = Router();

router.get("/", OrderController.getAllOrders);
router.post("/", OrderController.addNewOrder);
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const order = await OrderController.getOrderById(id);
        if (order) {
            res.json({ success: true, data: order });
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
            res.json(result);
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
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating order", error });
    }
});

export default router;