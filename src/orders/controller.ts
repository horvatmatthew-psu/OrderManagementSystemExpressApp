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
   