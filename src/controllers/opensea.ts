import { Request, Response } from 'express'
import { string } from 'yargs'
import config from '../config'
import * as openseaService from '../services/opensea/core'

export default {
  // https://docs.opensea.io/reference#retrieving-collections
  getCollections: async (req: Request, res: Response) => {
    try {
      const openseaResponse = await openseaService.getCollections()
      res.status(200).send(openseaResponse)
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  // https://docs.opensea.io/reference#getting-assets
  getAssets: async (req: Request, res: Response) => {
    try {
      const { collection = config.OPENSEA_COLLECTION_SLUG } = req.params
      const openseaResponse = await openseaService.getAssets({
        collection,
      })
      res.status(200).send(openseaResponse)
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  // https://docs.opensea.io/reference#retrieving-asset-events
  getEvents: async (req: Request, res: Response) => {
    try {
      const openseaResponse = await openseaService.getEvents({})
      res.status(200).send(openseaResponse)
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  // https://docs.opensea.io/reference#retrieving-a-single-asset
  getAsset: async (req: Request, res: Response) => {
    try {
      const { assetContractAddress, assetTokenId } = req.params
      const openseaResponse = await openseaService.getAsset(
        assetContractAddress,
        assetTokenId
      )
      res.status(200).send(openseaResponse)
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  getOrders: async (req: Request, res: Response) => {
    try {
      const openseaResponse = await openseaService.getOrders({})
      res.status(200).send(openseaResponse)
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  getAssetsForOwner: async (req: Request, res: Response) => {
    try {
      const { owner, offset = 0, limit = 50 } = req.params
      const openseaResponse = await openseaService.getAssetsForOwner({
        owner,
        offset,
        limit,
      })
      res.status(200).send(openseaResponse)
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  getAssetsForCreator: async (req: Request, res: Response) => {
    try {
      const { creator, offset = 0, limit = 50 } = req.params
      const openseaResponse = await openseaService.getAssetsForCreator({
        creator,
        offset,
        limit,
      })
      res.status(200).send(openseaResponse)
    } catch (error) {
      res.status(400).json({ error })
      console.log(error)
    }
  },
  retrieveArtistInformation: async (req: Request, res: Response) => {
    try {
      const { creatorId } = req.params
      const openseaResponse = await openseaService.retrieveArtistInformation({
        creatorId,
      })
      res.status(200).send(openseaResponse)
    } catch (error) {
      res.status(400).json({ error })
      console.log(error)
    }
  },
}
