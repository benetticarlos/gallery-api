import { Sequelize } from 'sequelize'

import config from '../config'

export const sequelize = config.DATABASE_URL
  ? new Sequelize(config.DATABASE_URL, {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
        },
      },
      ssl: true,
    })
  : new Sequelize(config.PG_DATABASE, config.PG_USER, config.PG_PASSWORD, {
      host: 'localhost',
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: false,
    })
