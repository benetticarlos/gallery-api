import Sequelize from 'sequelize'
import { sequelize } from '../db/database'

const ExhibitionsArtworks = sequelize.define(
  'exhibitionsartworks',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    exhibition_id: {
      type: Sequelize.INTEGER,
    },
    artwork_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
)

export default ExhibitionsArtworks
