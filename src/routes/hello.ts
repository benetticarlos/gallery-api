import express from 'express'
import HelloController from '../controllers/hello'

const router = express.Router()

router.route('/').get(HelloController.index)

export default router
