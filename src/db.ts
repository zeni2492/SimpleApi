import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    username: 'postgres',
    password: process.env.DB_PASSWORD,
    logging: false,
});

export { sequelize };

