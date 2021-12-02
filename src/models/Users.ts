import Sequelize, { DataTypes } from 'sequelize'
import { sequelize } from '../db/database'

import Playlists from './Playlists'
import Artworks from './Artworks'

const Users = sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.TEXT,
    },
    username: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    },
    profile_img_url: {
      type: Sequelize.TEXT,
    },
    cover_img_url: {
      type: Sequelize.TEXT,
    },
    public_address: {
      allowNull: false,
      type: Sequelize.TEXT,
      unique: true,
      validate: { isLowercase: true },
    },
    config: {
      type: Sequelize.TEXT,
    },
    email: {
      type: Sequelize.TEXT,
    },
    nonce: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    bio: {
      type: Sequelize.TEXT,
    },
    website: {
      type: Sequelize.TEXT,
    },
    twitter: {
      type: Sequelize.TEXT,
    },
    instagram: {
      type: Sequelize.TEXT,
    },
    discord: {
      type: Sequelize.TEXT,
    },
    discord_id: {
      type: Sequelize.TEXT,
    },
    youtube: {
      type: Sequelize.TEXT,
    },
    facebook: {
      type: Sequelize.TEXT,
    },
    tiktok: {
      type: Sequelize.TEXT,
    },
    snapchat: {
      type: Sequelize.TEXT,
    },
    creator: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
)

// Relations
// Playlists
Users.hasMany(Playlists, { foreignKey: 'user_id' })
Playlists.belongsTo(Users, { foreignKey: 'user_id' })

// Artworks through FavoritesArtworks
Users.belongsToMany(Artworks, { through: 'favoritesartworks' })
Artworks.belongsToMany(Users, { through: 'favoritesartworks' })

// UsersFollowing
Users.belongsToMany(Users, {
  as: 'Follower',
  foreignKey: 'follower_id',
  through: 'usersfollowing',
})
Users.belongsToMany(Users, {
  as: 'Followee',
  foreignKey: 'followee_id',
  through: 'usersfollowing',
})

export default Users
