import sequelize  from "../common/database";
import defineOrder from "../common/models/Order";

const Order = defineOrder(sequelize);

export const getAllOrders = async () => {
    try {
        const orders = await Order.findAll();
        return orders;
    } catch (error) {
        throw new Error("Error fetching orders: " + error);
    }
}

export const addNewOrder = async (customerName: string, totalAmount: number) => {
    try {
        const orderDate = new Date();
        const status = "Pending";
        const newOrder = await Order.create({ customerName, orderDate, totalAmount, status });
        return newOrder;
    } catch (error) {
        throw new Error("Error creating new order: " + error);
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
   