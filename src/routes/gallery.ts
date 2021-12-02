import express from 'express'
import controller from '../controllers/gallery'
import * as collectGallery from '../db/migrations/collectGallery'
import { userIdentity } from '../auth/access'

const router = express.Router()

// http://localhost:3000/v1/gallery
router
  .route('/featured-items')
  .get(userIdentity(), controller.featuredItemsQuery)

router
  .route('/gallery-items')
  .get(userIdentity(), collectGallery.collectionArtworkBy)

router
  .route('/gallery-item/:assetContractAddress/:assetTokenId')
  .get(userIdentity(), controller.galleryItemQuery)

router
  .route('/profile/:address/account')
  .get(userIdentity(), controller.profileAccountQuery)
router
  .route('/profile/:address/created-items')
  .get(userIdentity(), controller.profileCreatedGalleryItemsQuery)
router
  .route('/profile/:address/owned-items')
  .get(userIdentity(), controller.profileOwnedGalleryItemsQuery)

router.route('/event/:tokenAddress/:tokenId').post(controller.eventListener)

export default router
