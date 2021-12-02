import express from 'express'
import { authenticate } from '../controllers/auth'
const router = express.Router()

// http://localhost:3000/v1/auth
router.route('/').post(authenticate)

export default router
