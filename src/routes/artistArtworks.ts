import express from 'express'
import {
  addArtworkForArtist,
  getArtworks,
  getOneArtwork,
  deleteArtwork,
  getOneArtWorkWithOwnFollows,
} from '../controllers/artistArtworks'
const router = express.Router()

// http://localhost:3000/v1/artistArtworks

// add one artwork
router.post('/', addArtworkForArtist)
// get one artwork
router.get('/:asset_contract_address/:asset_token_id', getOneArtwork)
// get all artworks from one artist or all artworks if the query is empty
router.get('/:creator_address?', getArtworks)
// delete one artwork
router.delete('/:asset_contract_address/:asset_token_id', deleteArtwork)

router.get('/:artist_id', getOneArtWorkWithOwnFollows)

export default router
