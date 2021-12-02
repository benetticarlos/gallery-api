import Sequelize from 'sequelize'
import { sequelize } from '../db/database'

import FavoritesArtworks from './FavoritesArtworks'
import Playlists from './Playlists'

const Artworks = sequelize.define(
  'artworks',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    asset_id: {
      type: Sequelize.INTEGER,
    },
    asset_contract_address: {
      type: Sequelize.TEXT,
    },
    asset_token_id: {
      type: Sequelize.TEXT,
    },
    title: {
      type: Sequelize.TEXT,
    },
    description: {
      type: Sequelize.TEXT,
    },
    image_url: {
      type: Sequelize.TEXT,
    },
    image_preview_url: {
      type: Sequelize.TEXT,
    },
    image_thumbnail_url: {
      type: Sequelize.TEXT,
    },
    image_original_url: {
      type: Sequelize.TEXT,
    },
    video_url: {
      type: Sequelize.TEXT,
    },
    creator_username: {
      type: Sequelize.TEXT,
    },
    creator_image_url: {
      type: Sequelize.TEXT,
    },
    creator_address: {
      type: Sequelize.TEXT,
    },
    owner_username: {
      type: Sequelize.TEXT,
    },
    owner_image_url: {
      type: Sequelize.TEXT,
    },
    owner_address: {
      type: Sequelize.TEXT,
    },
    collection_slug: {
      type: Sequelize.TEXT,
    },
    collection_payout_address: {
      type: Sequelize.TEXT,
    },
    collection_name: {
      type: Sequelize.TEXT,
    },
    collection_image_url: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.TEXT,
    },
    price_eth: {
      type: Sequelize.TEXT,
    },
    price_usd: {
      type: Sequelize.TEXT,
    },
    is_featured: {
      type: Sequelize.BOOLEAN,
    },
    expiration: {
      type: Sequelize.TEXT,
    },
    schema_name: {
      type: Sequelize.TEXT,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    updatedAt: false,
    createdAt: false,
  }
)

// Relations
// This is already related at /models/Users ↓
// Artworks.hasMany(FavoritesArtworks)
// FavoritesArtworks.belongsTo(Artworks)
// Established a belongsToMany relation due to PlaylistsArtworks has 2 foreign keys(exhibition_id and artwork_id) - https://sequelize.org/v3/docs/associations/
Artworks.belongsToMany(Playlists, { through: 'playlistsartworks' })
Playlists.belongsToMany(Artworks, { through: 'playlistsartworks' })

export default Artworks
