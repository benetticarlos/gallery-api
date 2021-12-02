import { Router } from 'express'
import { restrictAccess } from '../auth/access'
import { userIdentity } from '../auth/access'
const router = Router()

import {
  createAssociationFavoritesArtworks,
  getAllFavoritesArtworksFromOneUserByAddress,
  deleteOneFavoriteArtworkFromOneUser,
  updatePriorityOfOneFavoriteArtwork,
  checkExistingFavoriteAssociation,
} from '../controllers/favoritesArtworks'

router.get('/:public_address', userIdentity(), getAllFavoritesArtworksFromOneUserByAddress) // ✔
router.post(
  '/add/:public_address/:asset_id',
  restrictAccess('public_address'),
  createAssociationFavoritesArtworks
) // ✔
router.delete(
  '/:asset_id/:public_address',
  restrictAccess('public_address'),
  deleteOneFavoriteArtworkFromOneUser
) // ✔
router.put(
  '/priority/:asset_id/:public_address',
  restrictAccess('public_address'),
  updatePriorityOfOneFavoriteArtwork
) // ✔
router.get(
  '/:public_address/:asset_id',
  userIdentity(),
  checkExistingFavoriteAssociation
)
export default router
