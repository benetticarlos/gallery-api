import { Router } from 'express'
const router = Router()

// Exhibition controllers
import {
  getAllExhibitions,
  createExhibition,
  getOneExhibitionByIdWithArtworks,
  deleteOneExhibition,
  updateOneExhibition,
  addAssociationToExhibitionArtworks,
  deleteAssociationFromExhibitionArtworks,
  updateAssociationFromExhibitionArtworks,
} from '../controllers/exhibition'

// /exhibition/
router.post('/', createExhibition) // ✔  Be Careful with deliverydate format: (YY--MM--DD)!
router.get('/', getAllExhibitions) // ✔

// /exhibition/:exhibition_id
router.get('/:exhibition_id', getOneExhibitionByIdWithArtworks)

router.delete('/:exhibition_id', deleteOneExhibition) //  ✔
router.put('/:exhibition_id', updateOneExhibition) //  ✔

/* EXHIBITION ARTWORKS / Associations */

// /exhibition/assets
router.post('/assets', addAssociationToExhibitionArtworks) // 3 ✔
// /exhibition/:exhibition_id/assets

// /exhibition/:assosiation_id/assets
router.put('/:association_id/assets', updateAssociationFromExhibitionArtworks)
router.delete(
  '/:association_id/assets/',
  deleteAssociationFromExhibitionArtworks
) // 4 ✔

export default router
