import sequelize  from "../common/database";
import defineOrder from "../common/models/Order";

const Order = defineOrder(sequelize);

export const getAllOrders = async (req: any, res: any) => {
    const orders = await Order.findAll();
    res.json({success: true, data:orders});
}

export const addNewOrder = async (req: any, res: any) => {
    const { customerName, orderDate, totalAmount, status } = req.body;
    try {
        const newOrder = await Order.create({ customerName, orderDate, totalAmount, status });
        res.json({ success: true, data: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating order", error });
    }
}

export const getOrderById = async (id: string) => {
    try {
        const order = await Order.findByPk(id);
        return order;
    } catch (error) {
        throw new Error("Error fetching order by ID: " + error);
    }
}

export const deleteOrderById = async (id: string) => {
    try {
        const order = await Order.findByPk(id);
        if (order) {
            await order.destroy();
            return { success: true, message: "Order deleted successfully" };
        } else {
            return { success: false, message: "Order not found" };
        }
    } catch (error) {
        throw new Error("Error deleting order by ID: " + error);
    }
}

export const patchOrderById = async (id: string, updateData: any) => {
    try {
        const order = await Order.findByPk(id);
        if (order) {
            const tempOrder = { ... order, ...updateData };
            await order.update(tempOrder);
            return { success: true, data: order };
        } else {
            return { success: false, message: "Order not found" };
        } 
    } catch (error) {
            throw new Error("Error updating order by ID: " + error);
    }    
}
   