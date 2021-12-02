import Sequelize from 'sequelize'
import { sequelize } from '../db/database'

const UsersFollowing = sequelize.define(
  'usersfollowing',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    follower_id: {
      type: Sequelize.INTEGER,
    },
    followee_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
)

export default UsersFollowing
