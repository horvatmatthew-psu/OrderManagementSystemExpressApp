import { Sequelize } from "sequelize";

const sequelize = new Sequelize('orders_db', 'username', 'password', {
    dialect: 'sqlite',
    storage: process.env.NODE_ENV === 'test' ? ':memory:' : './storage/data.db'
});

export default sequelize;