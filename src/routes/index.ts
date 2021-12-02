import express from 'express'
import openseaRouter from './opensea'
import galleryRouter from './gallery'
import artworksRouter from './artistArtworks'
import playlistRouter from './playlist'
import exhibitionRouter from './exhibition'
import followRouter from './follow'
import userRouter from './users'
import authRouter from './auth'
import favoritesRouter from './favoritesArtworks'

const router = express.Router()

router.use('/opensea', openseaRouter)
router.use('/gallery', galleryRouter)
router.use('/artistArtworks', artworksRouter)
router.use('/playlist', playlistRouter)
router.use('/exhibition', exhibitionRouter)
router.use('/follow', followRouter)
router.use('/users', userRouter)
router.use('/auth', authRouter)
router.use('/favorites', favoritesRouter)

export default router
