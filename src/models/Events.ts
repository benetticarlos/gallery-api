import Sequelize from 'sequelize'
import { sequelize } from '../db/database'

const Events = sequelize.define(
  'events',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    asset_id: {
      type: Sequelize.INTEGER,
    },
    asset_token_id: {
      type: Sequelize.TEXT,
    },
    asset_contract_address: {
      type: Sequelize.TEXT,
    },
    bid_amount: {
      type: Sequelize.TEXT,
    },
    duration: {
      type: Sequelize.TEXT,
    },
    created_date: {
      type: Sequelize.TEXT,
    },
    ending_price: {
      type: Sequelize.TEXT,
    },
    event_type: {
      type: Sequelize.TEXT,
    },
    starting_price: {
      type: Sequelize.TEXT,
    },
    transaction_from_account_address: {
      type: Sequelize.TEXT,
    },
    transaction_from_account_user: {
      type: Sequelize.TEXT,
    },
    transaction_from_account_profile_img_url: {
      type: Sequelize.TEXT,
    },
    transaction_to_account_address: {
      type: Sequelize.TEXT,
    },
    transaction_to_account_user: {
      type: Sequelize.TEXT,
    },
    transaction_to_account_profile_img_url: {
      type: Sequelize.TEXT,
    },
    transaction_timestamp: {
      type: Sequelize.TEXT,
    },
    transaction_hash: {
      type: Sequelize.TEXT,
    },
    payment_token_decimals: {
      type: Sequelize.NUMBER,
    },
    payment_token_eth_price: {
      type: Sequelize.TEXT,
    },
    payment_token_usd_price: {
      type: Sequelize.TEXT,
    },
    total_price: {
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

export default Events
