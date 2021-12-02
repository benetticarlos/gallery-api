import axios from 'axios'
import axiosRateLimit from 'axios-rate-limit'
import * as galleryService from '../../services/gallery'
import config from '../../config'
import { GalleryItem } from '../../types'

import Artworks from '../../models/Artworks'
import {
  AssetProps,
  EventProps,
  CollectionProps,
  SellOrderProps,
} from '../../types'

const ROOT = 'https://api.opensea.io/api/v1'
const API_KEY = config.OPENSEA_API_KEY ?? ''

const DEFAULT_HEADERS = {
  'X-API-KEY': API_KEY,
}

const OPTIONS = {
  headers: DEFAULT_HEADERS,
}

const http = axiosRateLimit(axios.create(), {
  maxRequests: 6,
  perMilliseconds: 150,
})

const get = async (url: string, queryParams = {}) => {
  return await http.get(url, { params: queryParams, ...OPTIONS })
}

// https://docs.opensea.io/reference#retrieving-a-single-asset
export const getAsset = async (
  assetContractAddress: string,
  assetTokenId: string
): Promise<AssetProps> => {
  const url = `${ROOT}/asset/${assetContractAddress}/${assetTokenId}`
  const res = await get(url)
  const asset = res.data ?? {}
  return asset
}

// https://docs.opensea.io/reference#getting-assets
export const getAssets = async (queryParams = {}): Promise<AssetProps[]> => {
  const url = `${ROOT}/assets`
  const res = await get(url, queryParams)
  const assets = res.data?.assets ?? []
  return assets
}

// https://docs.opensea.io/reference#retrieving-asset-events
export const getEvents = async (queryParams = {}): Promise<EventProps[]> => {
  const url = `${ROOT}/events`
  const res = await get(url, queryParams)
  const events = res.data?.asset_events ?? []
  return events
}

// https://docs.opensea.io/reference#retrieving-collections
export const getCollections = async (
  queryParams = {}
): Promise<CollectionProps[]> => {
  const url = `${ROOT}/collections`
  const res = await get(url, queryParams)
  const collections = res.data?.collections ?? []
  return collections
}

// https://api.opensea.io/api/v1/collections?asset_owner=0xf1c5f2c5acc61ecb847967bd0af2ecf1081cad4e
export const getCollectionsFromAccount = async (
  queryParams = {}
): Promise<CollectionProps[]> => {
  const url = `${ROOT}/collections?asset_owner=0xf1c5f2c5acc61ecb847967bd0af2ecf1081cad4e`
  const res = await get(url, queryParams)
  const collections = res.data ?? []
  return collections
}

// https://docs.opensea.io/reference#retrieving-collections
export const getOrders = async (
  queryParams = {}
): Promise<{
  count: number
  orders: SellOrderProps[]
}> => {
  const url = 'https://api.opensea.io/wyvern/v1/orders'
  const res = await get(url, queryParams)
  const collections = res.data ?? []
  return collections
}
export const getAssetsForOwner = async ({
  owner,
  offset,
  limit,
}: {
  owner: string
  offset: any
  limit: any
}): Promise<AssetProps[]> => {
  const url = `${ROOT}/assets?owner=${owner}&offset=${offset}&limit=${limit}`
  const res = await get(url)
  const asset = res.data?.assets ?? {}
  return asset
}

export const getAssetsForCreator = async ({
  creator,
  offset,
  limit,
}: {
  creator: string
  offset: any
  limit: any
}): Promise<AssetProps[]> => {
  const url = `${ROOT}/assets?owner=${creator}&order_by=current_escrow_price&order_direction=desc&offset=${offset}&limit=${limit}`
  const res = await get(url)
  const asset = res.data
  const creatorAssets = await asset.assets.filter(
    (assets: any) => assets.creator.address === creator
  )
  return creatorAssets
}

export const getAssetsFromAccountCollection = async ({
  offset,
  limit,
}: {
  offset: number
  limit: number
}) => {
  const galleryAddress = config.OPENSEA_GALLERY_ADDRESS
  const url = `https://api.opensea.io/api/v1/assets?owner=${galleryAddress}&order_by=current_escrow_price&order_direction=desc&offset=${offset}&limit=${limit}`
  const res = await get(url)
  const asset = res.data

  const dataFilterFromAccount = asset.assets.map((obj: any) => {
    const assetsFromAccount = {
      asset_contract_address: `${obj.asset_contract.address}`,
      token_id: `${obj.token_id}`,
      creator_address: `${obj.creator.address}`,
    }
    const asset_contract_address = assetsFromAccount.asset_contract_address
    const token_id = assetsFromAccount.token_id
    const creator_address = assetsFromAccount.creator_address

    if (creator_address !== galleryAddress) {
      Artworks.findOrCreate({
        where: {
          asset_contract_address,
          token_id,
          creator_address,
        },
        defaults: {
          asset_contract_address,
          token_id,
          creator_address,
        },
      })
    }
  })
  return dataFilterFromAccount
}

export const retrieveArtistInformation = async ({
  creatorId,
}: {
  creatorId: string
}) => {
  const url = `${ROOT}/assets?creator=${creatorId}&order_by=current_escrow_price&order_direction=desc&offset=0&limit=20`
  const res = await get(url)
  const asset = res.data
  const creatorAssets = await asset.assets.filter(
    (assets: any) => assets.creator.address === creatorId
  )
  const dataFilterFromArtist = creatorAssets.map((obj: any) => {
    const dataFromArtist = {
      collection: `${obj.collection}`,
      username: `${obj.creator.user.username}`,
      publicKey: `${obj.creator.address}`,
      profile_img_url: `${obj.creator.profile_img_url}`,
      bannerImageUrl: `${obj.banner_image_url}`,
    }
    return dataFromArtist
  })
  return dataFilterFromArtist
}

export const getArtworksFromAccountCollection = async (query: any) => {
  try {
    const assets = await galleryService.featuredItemsQuery(query)

    const dataFilterFromArtist = await assets.map((obj: GalleryItem) => {
      const data = {
        asset_id: obj.assetId,
        asset_contract_address: obj.assetContractAddress,
        asset_token_id: obj.assetTokenId,
        title: obj.title,
        description: obj.description,
        image_url: obj.imageUrl,
        image_preview_url: obj.imagePreviewUrl,
        image_thumbnail_url: obj.imageThumbnailUrl,
        image_original_url: obj.imageOriginalUrl,
        video_url: obj.videoUrl,
        creator_username: obj.creatorUsername,
        creator_image_url: obj.creatorImageUrl,
        creator_address: obj.creatorAddress,
        owner_username: obj.ownerUsername,
        owner_image_url: obj.ownerImageUrl,
        owner_address: obj.ownerAddress,
        collection_slug: obj.collectionSlug,
        collection_payout_address: obj.collectionPayoutAddress,
        collection_name: obj.collectionName,
        collection_image_url: obj.collectionImageUrl,
        status: obj.status,
        price_eth: obj.priceEth,
        price_usd: obj.priceUsd,
        is_featured: obj.is_featured,
        expiration: obj.expiration,
        schema_name: obj.schemaName,
      }

      return data
    })

    dataFilterFromArtist.forEach(async obj => {
      const oldArtwork = await Artworks.findOne({
        where: {
          asset_contract_address: obj.asset_contract_address,
          asset_token_id: obj.asset_token_id,
        },
      })

      if (oldArtwork) {
        // bloque

        Artworks.update(
          {
            asset_id: obj.asset_id,
            asset_contract_address: obj.asset_contract_address,
            asset_token_id: obj.asset_token_id,
            title: obj.title ? obj.title : null,
            description: obj.description ? obj.description : null,
            image_url: obj.image_url ? obj.image_url : null,
            image_preview_url: obj.image_preview_url
              ? obj.image_preview_url
              : null,
            image_thumbnail_url: obj.image_thumbnail_url
              ? obj.image_thumbnail_url
              : null,
            image_original_url: obj.image_original_url
              ? obj.image_original_url
              : null,
            video_url: obj.video_url ? obj.video_url : null,
            creator_username: obj.creator_username
              ? obj.creator_username
              : null,
            creator_image_url: obj.creator_image_url
              ? obj.creator_image_url
              : null,
            creator_address: obj.creator_address ? obj.creator_address : null,
            owner_username: obj.owner_username ? obj.owner_username : null,
            owner_image_url: obj.owner_image_url ? obj.owner_image_url : null,
            owner_address: obj.owner_address ? obj.owner_address : null,
            collection_slug: obj.collection_slug ? obj.collection_slug : null,
            collection_payout_address: obj.collection_payout_address
              ? obj.collection_payout_address
              : null,
            collection_name: obj.collection_name ? obj.collection_name : null,
            collection_image_url: obj.collection_image_url
              ? obj.collection_image_url
              : null,
            status: obj.status,
            price_eth: obj.price_eth ? obj.price_eth : null,
            price_usd: obj.price_usd ? obj.price_usd : null,
            expiration: obj.expiration ? obj.expiration : null,
            schema_name: obj.schema_name,
          },
          {
            where: {
              asset_contract_address: obj.asset_contract_address,
              asset_token_id: obj.asset_token_id,
            },
          }
        )
      } else {
        // otro bloque
        Artworks.create(
          {
            asset_id: obj.asset_id,
            asset_contract_address: obj.asset_contract_address,
            asset_token_id: obj.asset_token_id,
            title: obj.title ? obj.title : null,
            description: obj.description ? obj.description : null,
            image_url: obj.image_url ? obj.image_url : null,
            image_preview_url: obj.image_preview_url
              ? obj.image_preview_url
              : null,
            image_thumbnail_url: obj.image_thumbnail_url
              ? obj.image_thumbnail_url
              : null,
            image_original_url: obj.image_original_url
              ? obj.image_original_url
              : null,
            video_url: obj.video_url ? obj.video_url : null,
            creator_username: obj.creator_username
              ? obj.creator_username
              : null,
            creator_image_url: obj.creator_image_url
              ? obj.creator_image_url
              : null,
            creator_address: obj.creator_address ? obj.creator_address : null,
            owner_username: obj.owner_username ? obj.owner_username : null,
            owner_image_url: obj.owner_image_url ? obj.owner_image_url : null,
            owner_address: obj.owner_address ? obj.owner_address : null,
            collection_slug: obj.collection_slug ? obj.collection_slug : null,
            collection_payout_address: obj.collection_payout_address
              ? obj.collection_payout_address
              : null,
            collection_name: obj.collection_name ? obj.collection_name : null,
            collection_image_url: obj.collection_image_url
              ? obj.collection_image_url
              : null,
            status: obj.status,
            price_eth: obj.price_eth ? obj.price_eth : null,
            price_usd: obj.price_usd ? obj.price_usd : null,
            is_featured: false,
            expiration: obj.expiration ? obj.expiration : null,
            schema_name: obj.schema_name,
          },
          {
            fields: [
              'asset_id',
              'asset_contract_address',
              'asset_token_id',
              'title',
              'description',
              'image_url',
              'image_preview_url',
              'image_thumbnail_url',
              'image_original_url',
              'video_url',
              'creator_username',
              'creator_image_url',
              'creator_address',
              'owner_username',
              'owner_image_url',
              'owner_address',
              'collection_slug',
              'collection_payout_address',
              'collection_name',
              'collection_image_url',
              'status',
              'price_eth',
              'price_usd',
              'is_featured',
              'expiration',
              'schema_name',
            ],
          }
        )
      }
    })

    return dataFilterFromArtist
  } catch (error) {
    console.log(error)
  }
}
