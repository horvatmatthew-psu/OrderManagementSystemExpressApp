import { Router } from "express";
import * as OrderController from "./controller";

const router = Router();

router.get("/", OrderController.getAllOrders);

export default router;