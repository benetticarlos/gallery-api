import Sequelize from 'sequelize'
import { sequelize } from '../db/database'

const FavoritesArtworks = sequelize.define(
  'favoritesartworks',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    user_address: {
      type: Sequelize.TEXT,
    },
    artwork_id: {
      type: Sequelize.INTEGER,
    },
    priority: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
)

export default FavoritesArtworks
