import { config } from '@config';
import { Currency, Transaction, Wallet } from '@db/models';
import { Sequelize } from 'sequelize-typescript';

const connection = new Sequelize({
  dialect: process.env.NODE_ENV === 'test' ? 'sqlite' : 'postgres',
  storage: process.env.NODE_ENV === 'test' ? ':memory:' : undefined,
  host: config.dbHost,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  logging: false,
});

connection.addModels([Transaction, Currency, Wallet]);

export default connection;
