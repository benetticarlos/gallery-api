import Sequelize from 'sequelize'
import { sequelize } from '../db/database'

import ExhibitionsArtworks from './ExhibitionsArtworks'
import Artworks from './Artworks'

const Exhibitions = sequelize.define(
  'exhibitions',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.TEXT,
    },
    description: {
      type: Sequelize.TEXT,
    },
    banner_image_url: {
      type: Sequelize.TEXT,
    },
    image_url: {
      type: Sequelize.TEXT,
    },
    slug: {
      type: Sequelize.TEXT,
    },
    total_supply: {
      type: Sequelize.INTEGER,
    },
    num_owners: {
      type: Sequelize.INTEGER,
    },
    floor_price: {
      type: Sequelize.INTEGER,
    },
    total_volume: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
)

// Relations
// Established a belongsToMany relation due to ExhibitionsArtworks has 2 foreign keys(exhibition_id and artwork_id) - https://sequelize.org/v3/docs/associations/
Exhibitions.belongsToMany(Artworks, { through: 'exhibitionsartworks' })
Artworks.belongsToMany(Exhibitions, { through: 'exhibitionsartworks' })

export default Exhibitions
