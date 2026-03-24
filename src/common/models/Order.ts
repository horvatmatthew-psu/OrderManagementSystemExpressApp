import { DataTypes} from "sequelize";

const OrderModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

export default (sequelize: any) => {
    const Order = sequelize.define('Order', OrderModel, {
        tableName: 'orders',
        timestamps: false
    });
    return Order;
}