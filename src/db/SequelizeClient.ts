import { Sequelize } from 'sequelize-typescript';
import { config } from '@config';

const connection = new Sequelize({
  dialect: 'postgres',
  host: config.dbHost,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  logging: false,
  models: [__dirname + './models/**.ts'],
});

export default connection;
