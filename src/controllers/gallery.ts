import { Request, Response } from 'express'
import Artworks from '../models/Artworks'
import Users from '../models/Users'
import Events from '../models/Events'
import FavoritesArtworks from '../models/FavoritesArtworks'
import { keysToCamel } from '../utils'
import {
  getEvents,
  getArtworksFromAccountCollection,
} from '../services/opensea/core'
import { UserWithName } from '../types'
export default {
  featuredItemsQuery: async (req: Request, res: Response) => {
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
      res.status(400).json(error)
    }
  },
  galleryItemQuery: async (req: Request, res: Response) => {
    try {
      const { assetContractAddress, assetTokenId } = req.params // How can I take this out of the Promise<GalleryItem>
      const artwork = await Artworks.findOne({
        where: {
          asset_contract_address: assetContractAddress,
          asset_token_id: assetTokenId,
        },
      })

      const galleryResponse = keysToCamel((artwork as any).dataValues)

      const allEvents = await Events.findAll({
        where: {
          asset_contract_address: assetContractAddress,
          asset_token_id: assetTokenId,
        },
      })

      const historyItems = allEvents.map((eventItem: any) =>
        keysToCamel(eventItem.dataValues)
      )

      galleryResponse.historyItems = historyItems

      if (req.user) {
        const favorite = await FavoritesArtworks.findOne({
          where: {
            user_id: (req.user as any).id,
            artwork_id: galleryResponse.id,
          },
        })
        galleryResponse.isFavorite = !!favorite
      }

      const expReg = new RegExp('- edition of ([0-9]+)', 'i')

      if (expReg.test(galleryResponse.title)) {
        const match = galleryResponse.title.match(expReg)
        galleryResponse.editionOf = match[1]
      } else {
        galleryResponse.editionOf = '1'
      }

      res.status(200).send(galleryResponse)
    } catch (error) {
      res.status(404).json(error)
    }
  },
  profileAccountQuery: async (req: Request, res: Response) => {
    try {
      const { address } = Object.assign({}, req.params, req.query)
      const artwork = await Users.findOne({
        where: {
          public_address: address,
        },
      })
      const galleryResponse = keysToCamel((artwork as any).dataValues)

      if (req.user) {
        const favorite = await FavoritesArtworks.findOne({
          where: {
            user_id: (req.user as any).id,
            artwork_id: galleryResponse.id,
          },
        })
        galleryResponse.isFavorite = !!favorite
      }

      res.status(200).send(galleryResponse)
    } catch (error) {
      res.status(404).json(error)
    }
  },
  profileCreatedGalleryItemsQuery: async (req: Request, res: Response) => {
    try {
      const { address } = Object.assign({}, req.params, req.query)
      const { offset = '0', limit = '20' } = req.query
      const artworks = await Artworks.findAll({
        where: { creator_address: address },
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
      res.status(404).json(error)
    }
  },
  profileOwnedGalleryItemsQuery: async (req: Request, res: Response) => {
    try {
      const { address } = Object.assign({}, req.params, req.query)
      const { offset = '0', limit = '20' } = req.query
      const artworks = await Artworks.findAll({
        where: { owner_address: address },
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
      res.status(404).json(error)
    }
  },
  eventListener: async (req: Request, res: Response) => {
    try {
      const { tokenAddress, tokenId } = req.params
      const events = await getEvents({
        offset: 0,
        limit: 50,
        asset_contract_address: tokenAddress,
        token_id: tokenId,
        only_opensea: false,
      })

      events.forEach(async event => {
        const matchEvent = await Events.findOne({
          where: {
            asset_id: event.asset.id,
            asset_token_id: event.asset.token_id,
            asset_contract_address: event.asset.asset_contract
              ? event.asset.asset_contract.address
              : null,
            created_date: event.created_date,
          },
        })

        if (!matchEvent) {
          await Events.findOrCreate({
            where: {
              asset_id: event.asset.id,
              asset_token_id: event.asset.token_id,
              asset_contract_address: event.asset.asset_contract
                ? event.asset.asset_contract.address
                : null,
              bid_amount: event.bid_amount,
              duration: event.duration,
              created_date: event.created_date,
              ending_price: event.ending_price,
              event_type: event.event_type,
              starting_price: event.starting_price,
              transaction_from_account_address: event.from_account
                ? event.from_account.address
                : null,
              transaction_from_account_user: !event.transaction
                ? null
                : !event.transaction.from_account
                ? null
                : !event.transaction.from_account.user
                ? null
                : (event.transaction.from_account.user as UserWithName)
                    .username,
              transaction_from_account_profile_img_url: event.from_account
                ? event.from_account.profile_img_url
                : null,
              transaction_to_account_address: event.to_account
                ? event.to_account.address
                : null,
              transaction_to_account_user: !event.transaction
                ? null
                : !event.transaction.to_account
                ? null
                : !event.transaction.to_account.user
                ? null
                : (event.transaction.to_account.user as UserWithName).username,
              transaction_to_account_profile_img_url: event.to_account
                ? event.to_account.profile_img_url
                : null,
              transaction_timestamp: event.transaction
                ? event.transaction.timestamp
                : null,
              transaction_hash: event.transaction
                ? event.transaction.transaction_hash
                : null,
              payment_token_decimals: event.payment_token
                ? event.payment_token.decimals
                : null,
              payment_token_eth_price: event.payment_token
                ? event.payment_token.eth_price
                : null,
              payment_token_usd_price: event.payment_token
                ? event.payment_token.usd_price
                : null,
            },
          })
        }
      })

      const artworks = await getArtworksFromAccountCollection({
        asset_contract_address: tokenAddress,
      })

      res.json({
        artworks,
      })
    } catch (error) {
      res.json({ message: error })
    }
  },
}
