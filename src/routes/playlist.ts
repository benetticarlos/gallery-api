import { Router } from 'express'
import { restrictAccess, userIdentity } from '../auth/access'

const router = Router()

// Playlists controllers
import {
  createPlaylist,
  getPlaylists,
  getOnePlaylistByIdWithRelatedArtworks,
  deleteOnePlaylistByIdWithAssociatedArtworks,
  updateOnePlaylistById,
  addArtworkToNewPlaylist,
  deleteArtworkFromPlaylist,
  addArtworkToExistingPlaylist,
  updateArtworksPriorities,
} from '../controllers/playlist'


// /playlist/0x4a20de27d1346d80046910dc428338a49cec53e6
router.post(
  '/:user_address',
  restrictAccess('user_address'),createPlaylist
)

/* 2 options:
1) GET ALL PLAYLISTS at bdd: /playlist
2) GET one user playlists by query: /playlist/?user_address=0x4a20de27d1346d80046910dc428338a49cec53e6
*/
router.get('/', userIdentity(), getPlaylists)

// /playlist/:playlist_id
router.get('/:playlist_id', userIdentity(), getOnePlaylistByIdWithRelatedArtworks)


router.delete(
  '/:playlist_id',
  restrictAccess('user_address'),
  deleteOnePlaylistByIdWithAssociatedArtworks
)

router.put('/:playlist_id', restrictAccess('user_address'),updateOnePlaylistById)

router.put('/', restrictAccess('user_address'), updateArtworksPriorities)

router.post(
  '/',
  restrictAccess('user_address'),
  addArtworkToNewPlaylist
)

router.post('/addArtwork/:playlist_id',
  restrictAccess('user_address'),
  addArtworkToExistingPlaylist
)

router.delete(
  '/:playlist_id/:artwork_id/assets',
  restrictAccess('user_address'),
  deleteArtworkFromPlaylist
)

export default router
