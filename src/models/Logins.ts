import Sequelize from 'sequelize'
import { sequelize } from '../db/database'

import Users from './Users'

const Logins = sequelize.define(
  'logins',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    email: {
      type: Sequelize.TEXT,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: Sequelize.TEXT,
    },
    reset_password_code: {
      type: Sequelize.TEXT,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
)

export default Logins
