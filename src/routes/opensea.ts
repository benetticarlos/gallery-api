import express from 'express'
import expressRedisCache from 'express-redis-cache'

import controller from '../controllers/opensea'
import config from '../config/index'

const cache = expressRedisCache({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  auth_pass: config.REDIS_AUTH,
})
const router = express.Router()

// http://localhost:3000/v1/opensea
router.route('/events').get(cache.route({ expire: 15 }), controller.getEvents)
router.route('/assets').get(cache.route({ expire: 15 }), controller.getAssets)
router.route('/asset/:assetContractAddress/:assetTokenId').get(cache.route({ expire: 15 }), controller.getAsset)
router.route('/collections').get(cache.route({ expire: 15 }), controller.getCollections)
router.route('/order').get(controller.getOrders)
router.route(`/owner/:owner`).get(cache.route({ expire: 15 }), controller.getAssetsForOwner)
router.route(`/registry/:creator`).get(cache.route({ expire: 15 }), controller.getAssetsForCreator)
router.route('/creator/:creatorId').get(cache.route({ expire: 15 }), controller.retrieveArtistInformation)

export default router
