import sequelize  from "../common/database";
import defineOrder from "../common/models/Order";

const Order = defineOrder(sequelize);

export const getAllOrders = async (req: any, res: any) => {
    const orders = await Order.findAll();
    res.json({success: true, data:orders});
}