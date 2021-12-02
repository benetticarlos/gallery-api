import { Request, Response } from 'express'
import { getArtworksFromAccountCollection } from '../../services/opensea/core'
import Artworks from '../../models/Artworks'
// import cron from 'node-cron'

export const collectionArtworkBy = async (req: Request, res: Response) => {
  try {
    const { offset = 0, limit = 50, ...where }: any = req.query || {}
    const artworks = await Artworks.findAll({
      where,
      offset,
      limit,
    })

    const dataFilterFromAccount = artworks.map((obj: any) => {
      const assetsFromAccount = {
        assetId: `${obj.asset_id}`,
        assetContractAddress: `${obj.asset_contract_address}`,
        assetTokenId: `${obj.asset_token_id}`,
        title: `${obj.title}`,
        description: `${obj.description}`,
        imageUrl: `${obj.image_url}`,
        imagePreviewUrl: `${obj.image_preview_url}`,
        imageThumbnailUrl: `${obj.image_thumbnail_url}`,
        imageOriginalUrl: `${obj.image_original_url}`,
        videoUrl: `${obj.video_url}`,
        creatorUsername: `${obj.creator_username}`,
        creatorImageUrl: `${obj.creator_image_url}`,
        creatorAddress: `${obj.creator_address}`,
        ownerUsername: `${obj.owner_username}`,
        ownerImageUrl: `${obj.owner_image_url}`,
        ownerAddress: `${obj.owner_address}`,
        collectionSlug: `${obj.collection_slug}`,
        collectionPayoutAddress: `${obj.collection_payout_address}`,
        collectionName: `${obj.collection_name}`,
        collectionImageUrl: `${obj.collection_image_url}`,
        status: `${obj.status}`,
        priceEth: `${obj.price_eth}`,
        priceUsd: `${obj.price_usd}`,
        expiration: `${obj.expiration}`,
      }

      return assetsFromAccount
    })

    res.json({
      data: dataFilterFromAccount,
    })
  } catch (error) {
    res.json({
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
