import Sequelize from 'sequelize'
import { sequelize } from '../db/database'

const PlaylistsArtworks = sequelize.define(
  'playlistsartworks',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    playlist_id: {
      type: Sequelize.INTEGER,
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

export default PlaylistsArtworks
