import * as dotenv from 'dotenv'

dotenv.config()

const config = {
  OPENSEA_API_KEY: process.env.OPENSEA_API_KEY,
  OPENSEA_GALLERY_ADDRESS: process.env.OPENSEA_GALLERY_ADDRESS,
  OPENSEA_COLLECTION_SLUG:
    process.env.OPENSEA_COLLECTION_SLUG ?? ' ',
  REDIS_HOST: process.env.REDIS_HOST ?? '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT ?? 6379,
  REDIS_AUTH: process.env.REDIS_AUTH,
  INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
  INFURA_SECRET: process.env.INFURA_SECRET,
  INFURA_HTTPS_ENDPOINT: process.env.INFURA_HTTPS_ENDPOINT,
  INFURA_WSS_ENDPOINT: process.env.INFURA_WSS_ENDPOINT,
  MNEMONIC: process.env.MNEMONIC,
  INFURA_KEY: process.env.INFURA_KEY,
  MY_ADDRESS: process.env.MY_ADDRESS,
  NETWORK: process.env.NETWORK,
  API_KEY: process.env.API_KEY,
  DATABASE_URL:
    process.env.HEROKU_POSTGRESQL_BLACK_URL || process.env.DATABASE_URL,
  PG_DATABASE: process.env.PG_DATABASE || 'postgres',
  PG_USER: process.env.PG_USER || 'postgres',
  PG_PASSWORD: process.env.PG_PASSWORD || 'password',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  WEB_SITE_URL: process.env.WEB_SITE_URL || 'http://localhost:8000',
  DEVELOPMENT: process.env.DEVELOPMENT,
  BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  REGION: process.env.AWS_BUCKET_REGION,
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_KEY,
  STAGING_URL: process.env.STAGING_URL || 'nft-gallery-production.netlify.app',
  CLOUD_FRONT_URL:
    process.env.CLOUD_FRONT_URL || 'https://dqcpbhvjtm7v4.cloudfront.net',
}

export default config
