import { last, sortBy } from 'lodash'
import {
  getAsset,
  getAssetsByCollectionSlug,
  getMetadataForAsset,
  getMetadataForAssets,
} from '../../opensea'
import {
  Account,
  GalleryItem,
  EventProps,
  AssetProps,
  GalleryItemStatus,
} from '../../../types'
import { NULL_ADDRESS } from '../../../utils'

import { historyItemsFrom } from './historyItem'

// Public

export const featuredItemsQuery = async (
  query: any
): Promise<GalleryItem[]> => {
  // TODO: filter by featured
  const collectionAssets = await getAssetsByCollectionSlug(
    query,
    'Account-gallery-nifty'
  )
  const hydratedAssets = await getMetadataForAssets(collectionAssets)
  const collectionItems = hydratedAssets.map(galleryItemFromHydratedAsset)
  // const pricedCollectionItems = collectionItems.map(pricedItemFromGalleryItem)
  return collectionItems
}

export const galleryItemQuery = async ({
  assetContractAddress,
  assetTokenId,
}: {
  assetContractAddress: string
  assetTokenId: string
}): Promise<GalleryItem> => {
  const asset = await getAsset(assetContractAddress, assetTokenId)
  return await galleryItemFromAsset(asset)
}

export const galleryItemFromAsset = async (
  asset: any
): Promise<GalleryItem> => {
  const hydratedAsset = await getMetadataForAsset(asset)
  const galleryItem = galleryItemFromHydratedAsset(hydratedAsset)
  const historyItems = historyItemsFrom({ galleryItem, hydratedAsset })
  return Object.assign({}, galleryItem, { historyItems })
}

export const ownerFromAsset = async (asset: any): Promise<Account> => {
  const hydratedAsset = await getMetadataForAsset(asset)
  const owner = ownerFrom(hydratedAsset)

  return owner
}

export const creatorFromAsset = async (asset: any): Promise<Account> => {
  const hydratedAsset = await getMetadataForAsset(asset)
  const creator = creatorFrom(hydratedAsset)

  return creator
}

// Private

const creatorFrom = ({ asset, events, status }: any) => {
  if (asset?.creator?.address === NULL_ADDRESS) {
    if (events == null) {
      console.error('[creatorFrom] unexpected null events')
      return null
    }

    if (events.length === 0) {
      console.error('[creatorFrom] unexpected null events')
      return null
    }

    // TODO: other edge cases

    return null
  }

  return asset?.creator
}

const orderByTimestamp = (events: EventProps[] = []) =>
  sortBy(events, 'created_date')

export const mostRecentEvent = (events: EventProps[] = []) =>
  last(orderByTimestamp(events))

const ownerFrom = ({ asset, events, status }: any) => {
  if (asset?.owner?.address === NULL_ADDRESS) {
    if (events == null) {
      console.error('[ownerFrom] unexpected null events')
      return null
    }

    if (events.length === 0) {
      console.error('[ownerFrom] unexpected null events')
      return null
    }

    const most_recent_event = mostRecentEvent(events)
    if (most_recent_event.event_type === 'transfer') {
      return most_recent_event.to_account
    }

    if (most_recent_event.event_type === 'successful') {
      return most_recent_event.winner_account
    }

    if (most_recent_event.event_type === 'created') {
      return most_recent_event.from_account
    }

    const most_recent_transfer_event = mostRecentEvent(
      events.filter((e: any) => e.event_type === 'transfer')
    )
    if (
      most_recent_transfer_event != null &&
      most_recent_transfer_event.to_account != null
    ) {
      return most_recent_transfer_event.to_account
    }

    // TODO: other edge cases

    return null
  }

  return asset?.owner
}

const galleryItemFromHydratedAsset = ({
  asset,
  events,
  status,
  expiration,
  price_eth,
  price_usd,
}: {
  asset: AssetProps
  events: EventProps[]
  status: GalleryItemStatus
  expiration: string
  price_eth: string
  price_usd: string
}): GalleryItem => {
  const creator = creatorFrom({ asset, events, status })
  const owner = ownerFrom({ asset, events, status })
  const collection = asset?.collection
  const galleryItem: GalleryItem = {
    assetId: asset?.id,
    assetContractAddress: asset?.asset_contract?.address,
    assetTokenId: asset?.token_id,

    title: asset?.name,
    description: asset?.description,

    imageUrl:
      asset?.image_url ?? asset?.image_original_url ?? asset?.image_preview_url,
    imagePreviewUrl: asset?.image_preview_url,
    imageThumbnailUrl: asset?.image_thumbnail_url,
    imageOriginalUrl: asset?.image_original_url,
    videoUrl: asset?.animation_url ?? asset?.animation_original_url,

    creatorUsername: creator?.user?.username,
    creatorImageUrl: creator?.profile_img_url,
    creatorAddress: creator?.address,

    ownerUsername: owner?.user?.username,
    ownerImageUrl: owner?.profile_img_url,
    ownerAddress: owner?.address,

    collectionSlug: collection?.slug,
    collectionPayoutAddress: collection?.payout_address,
    collectionName: collection?.name,
    collectionImageUrl: collection?.image_url,

    status,

    priceEth: price_eth,
    priceUsd: price_usd,

    historyItems: [],

    expiration,
    schemaName: asset?.asset_contract.schema_name,
    // endingIn: '',
  }

  return Object.assign({}, galleryItem, {
    historyItems: historyItemsFrom({
      galleryItem,
      hydratedAsset: {
        asset,
        events,
        status,
        expiration,
        price_eth,
        price_usd,
      },
    }),
  })
}
