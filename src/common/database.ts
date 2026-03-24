import { Sequelize } from "sequelize";

const sequelize = new Sequelize('orders_db', 'username', 'password', {
    dialect: 'sqlite',
    storage: './storage/data.db'
});

export default sequelize;