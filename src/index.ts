import 'reflect-metadata';

import * as dotenv from 'dotenv';
dotenv.config();
import { registerRouters } from '@application/controllers';
import { config } from '@config';
import cors from 'cors';
import express from 'express';
import http from 'http';
import pinoLogger from 'pino';
import { Sequelize } from 'sequelize/types';

import connection from './db/SequelizeClient';

const app = express();

app.use(cors());
app.use(express.json());
registerRouters(app);

let server: http.Server;
let dbClient: Sequelize | undefined;
const start = async () => {
  try {
    dbClient = await connection.sync();
    server = app.listen(config.port, (): void => {
      const logger = pinoLogger();
      logger.info(`App listening on port ${config.port}`);
    });
  } catch (error: any) {
    console.error(`Error occurred: ${error.message}`);
  }
};

start();

process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  if (dbClient) dbClient.close();
  if (server) server.close();
});
