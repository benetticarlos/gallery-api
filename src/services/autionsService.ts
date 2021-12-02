// import { auctions } from '../config/api'
import config from '../config'
import { GalleryItem, QueryType, UserProps, UserWithName } from '../types'
import { paginatedQuery } from '../utils'
import { getAssetsByCollectionSlug } from './opensea'

export async function getCreators(): Promise<{ creators: UserProps[] }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        creators: [],
      })
    }, 250)
  })
}

export async function getArtworkAuctions(query: QueryType) {
  return await getAssetsByCollectionSlug(query, config.OPENSEA_COLLECTION_SLUG)
}

export async function getArtworkAuctionsPaginated(): Promise<GalleryItem[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([])
    }, 250)
  })
}

export async function getArtwork(
  id: number
): Promise<{ artwork: GalleryItem }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        artwork: undefined,
      })
    }, 250)
  })
}

export async function getHeroArtwork(
  id: string
): Promise<{ artwork: GalleryItem }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        artwork: undefined,
      })
    }, 250)
  })
}

export async function getCreator(
  username: string
): Promise<{ creator: UserProps[] }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        creator: undefined,
      })
    }, 250)
  })
}
