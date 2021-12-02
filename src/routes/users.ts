import express from 'express'
import { Request, Response } from 'express'
import { findUsers, createUser, updateUser } from '../controllers/users'
import { restrictAccess, userIdentity } from '../auth/access'
const router = express.Router()

import path from 'path'

const multer = require('multer')
const upload = multer({ dest: 'src/public/images' })

import { getFileStream } from '../services/AWS/s3'

// http://localhost:3000/v1/users

// find or create user
router.route('/').get(userIdentity(),findUsers)

router.post('/', createUser)

// get profile img from s3
router.get('/images/:key', userIdentity(), (req: Request, res: Response) => {
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
})

// update user and upload profile img to s3
const cpUpload = upload.fields([
    { name: 'profile_img_url' },
    { name: 'cover_img_url' },
])

router.post(
  '/update/:public_address',
  restrictAccess('public_address'),
  cpUpload,
  updateUser
)

export default router
