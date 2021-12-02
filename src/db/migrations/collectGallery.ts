import { Request, Response } from 'express'
import { keysToCamel } from '../../utils'
import { getArtworksFromAccountCollection } from '../../services/opensea/core'

import Artworks from '../../models/Artworks'
import FavoritesArtworks from '../../models/FavoritesArtworks'
import Events from '../../models/Events'
// import cron from 'node-cron'

export const collectionArtworkBy = async (req: Request, res: Response) => {
  try {
    const { offset = 0, limit = 20, ...query } = req.query
    const artworks = await Artworks.findAll({
      where: query,
      offset: parseInt(offset as string, 10),
      limit: parseInt(limit as string, 10),
    })

    const galleryResponse = artworks.map(artwork =>
      keysToCamel((artwork as any).dataValues)
    )

    if (req.user) {
      const associations = (
        await FavoritesArtworks.findAll({
          where: { user_id: (req.user as any).id },
        })
      ).map(v => (v as any).dataValues)
      galleryResponse.forEach(artwork => {
        artwork.isFavorite =
          associations.findIndex(f => f.artwork_id === artwork.id) >= 0
      })
    }

    res.status(200).send(galleryResponse)
  } catch (error) {
    res.status(500).json({
      error,
    })
  }
}

export class GalleryItems {
  static async AccountCollectionArtworks() {
    try {
      let offset = 0
      const limit = 50
      let collectionResponse = await getArtworksFromAccountCollection({
        offset,
        limit,
      })

      for (let i = 1; collectionResponse.length > 0; i++) {
        offset = i * 50

        collectionResponse = await getArtworksFromAccountCollection({
          offset,
          limit,
        })

        console.log(
          'added ' + collectionResponse.length + ' Gallery items in DB'
        )
      }
    } catch (error) {
      console.log(error)
    }
  }
}
