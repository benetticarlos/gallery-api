import { QueryType } from '../../types'
import config from '../../config'
import { getAsset, getAssets, getEvents, getCollections } from './core'
import {
  getMetadataForAsset,
  getMetadataForAssets,
  getExpandedAsset,
  getExpandedAssets,
} from './asset'

// Core

export { getAsset, getAssets, getEvents, getCollections }

// Asset

export {
  getMetadataForAsset,
  getMetadataForAssets,
  getExpandedAsset,
  getExpandedAssets,
}

// Other Non-Core

export const getAssetsByCollectionSlug = async (
  query: any,
  collectionSlug = config.OPENSEA_COLLECTION_SLUG
) => {
  const {
    order_by = 'pk',
    order_direction = 'desc',
    offset = 0,
    limit = 50,
  } = query || {}

  const assets = await getAssets({
    collection: collectionSlug,
    order_by,
    order_direction,
    offset,
    limit,
  })
  return assets
}

export const getEventsByCollectionSlug = async (
  collectionSlug = config.OPENSEA_COLLECTION_SLUG
  // {  } = {}
) => {
  // asset_contract_address, token_id, account_address, event_type
  // only_opensea: false
  // offset, limit
  // occurred_before, occurred_after
  const events = getEvents({
    collection_slug: collectionSlug,
  })
  return events
}
