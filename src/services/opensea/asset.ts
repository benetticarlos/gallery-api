import { last, sortBy } from 'lodash'
import { DateTime } from 'luxon'

import config from '../../config'

import { getAsset, getEvents } from './core'
import { priceFromPriceData } from './util'

import Events from '../../models/Events'

import { keysToCamel } from '../../utils'

import {
  EventField,
  EventMap,
  AssetProps,
  GalleryItemStatus,
} from '../../types'

// Asset

export const getMetadataForAsset = async (asset: AssetProps) => {
  const assetTokenId = asset?.token_id
  const assetTokenAddress = asset?.asset_contract.address

  const allEvents = await Events.findAll({
    where: {
      asset_token_id: assetTokenId,
      asset_contract_address: assetTokenAddress,
    },
  })

  const events = allEvents.map((eventItem: any) => eventItem.dataValues)

  const status = assetStatusFrom({ asset, events })
  const expiration = assetExpirationDateTime({ asset, events })
  const { price_eth, price_usd } = assetPrice({ asset, events }) ?? {}
  return {
    asset,
    events,
    status,
    expiration,
    price_eth,
    price_usd,
  }
}

export const getMetadataForAssets = async (assets: AssetProps[] = []) => {
  const hydratedAssets = await Promise.all(
    assets.map(asset => getMetadataForAsset(asset))
  )
  return hydratedAssets
}

// Use when you need more fields than those returned by a getAssets query
export const getExpandedAsset = async (asset: AssetProps) => {
  const expandedAsset = await getAsset(
    asset?.asset_contract?.address,
    asset?.token_id
  )
  return expandedAsset
}

// Use when you need more fields than those returned by a getAssets query
export const getExpandedAssets = async (assets: AssetProps[] = []) => {
  const expandedAssets = await Promise.all(assets.map(getExpandedAsset))
  return expandedAssets
}

export const getEventsForAsset = async ({
  assetContractAddress,
  assetTokenId,
}: {
  assetContractAddress: string
  assetTokenId: string
}) => {
  const events = await getEvents({
    asset_contract_address: assetContractAddress,
    token_id: assetTokenId,
  })
  return events
}

export const mostRecentEvent = (events: EventField[] = []) =>
  last(orderByTimestamp(events))

const STATUS_EVENT_TYPES = [
  'created',
  'approve',
  'transfer',
  'cancelled',
  'successful',
]

const hasEventExpired = (event: EventField): boolean => {
  if (!event) return true

  const { created_date: created_at, duration: duration_seconds } = event

  const created_at_datetime = DateTime.fromISO(created_at)
  const end = created_at_datetime.plus({
    seconds: parseInt(duration_seconds, 10) as number,
  })

  return DateTime.now() > end
}

// Helpers

const orderByTimestamp = (events: EventField[] = []) =>
  sortBy(events, 'created_date')

const BID_EVENT_TYPES = ['bid_entered', 'offer_entered']
export const isBidOrOfferEvent = (event: EventField) =>
  BID_EVENT_TYPES.includes(event?.event_type)

export const currentOrderFrom = ({ asset }: { asset: AssetProps }) => {
  const currentOrder = asset.sell_orders?.reduce((acc, order) => {
    const { created_date: created_at, expiration_time } = order
    const created_at_datetime = DateTime.fromISO(created_at)
    const end = created_at_datetime.plus({
      seconds: expiration_time as number,
    })
    if (expiration_time <= 0 || DateTime.now() < end) {
      return order
    }
    return acc
  }, undefined)
  return currentOrder
}

export const assetStatusFrom = ({
  asset,
  events = [],
}: {
  asset: AssetProps
  events: any[]
}): GalleryItemStatus => {
  const currentOrder = currentOrderFrom({ asset })
  if (currentOrder) {
    return GalleryItemStatus.buy_now
  }

  const orderedEvents = orderByTimestamp(events).reverse()
  const statusEvent = orderedEvents.find(value =>
    STATUS_EVENT_TYPES.includes(value.event_type)
  )

  return statusEvent?.event_type === 'created' && !hasEventExpired(statusEvent)
    ? GalleryItemStatus.on_auction
    : GalleryItemStatus.none
}

const assetPriceData = ({
  asset,
  events = [],
}: {
  asset: AssetProps
  events: EventField[]
}) => {
  const status = assetStatusFrom({ asset, events })
  if (status === GalleryItemStatus.on_auction) {
    return (
      // highestOpenBidOrOfferPriceData({ asset, events }) ??
      highestOpenBidOrOfferPriceData() ??
      mostRecentBidOrOfferPriceData(events) ??
      mostRecentListingPriceData(events)
    )
  } else if (status === GalleryItemStatus.buy_now) {
    return mostRecentSalePriceData({ asset, events })
  }
  return {
    price: '',
    token: {
      decimals: '',
      eth_price: '',
      usd_price: '',
    },
  }
}

export const assetPrice = ({
  asset,
  events = [],
}: {
  asset: AssetProps
  events: EventField[]
}) => {
  const { price, token } = assetPriceData({ asset, events }) ?? {}
  if (price === null) {
    return null
  }
  const { price_eth, price_usd } = priceFromPriceData({ price, token })
  return { price_eth, price_usd }
}

const assetExpirationDateTime = ({ asset = {}, events = [] }) => {
  const most_recent_listing_event = mostRecentEvent(
    events.filter(e => e?.event_type === 'created')
  )

  const { created_date: created_at, duration: duration_seconds } =
    most_recent_listing_event ?? {}

  if (!duration_seconds) {
    return ''
  }

  const created_at_datetime = DateTime.fromISO(created_at)

  const seconds = parseInt(duration_seconds, 10)
  const end = created_at_datetime.plus({
    seconds,
  })

  return end.toISO()
}

// Helpers

// { asset: AssetProps = {}, events = [],}
const highestOpenBidOrOfferPriceData = (): any => {
  // This is difficult to determine because:
  //   - how do we know which offers are open?
  //   - have to get the latest events that occurred after the most recent
  //     auction has been completed or canceled
  //   - but also we can have offers before the first auction is created
  //   - and what about transfers??

  // TODO
  // const sorted = orderByTimestamp(events)
  // if (assetStatusFrom({ asset, events }) !== 'listed') {
  //   const latest = takeRightWhile(sorted, e => e?.event_type !== 'offer_entered')
  // }
  // const latest = takeRightWhile(sorted, e => ![''].includes(e?.event_type))
  // const bid_and_offer_events = events.filter(isBidOrOfferEvent)
  // const highest

  return null
}

const bidOrOfferPriceData = (event: EventField) => {
  if (event === null || !isBidOrOfferEvent(event)) {
    return null
  }
  return {
    price: event?.bid_amount,
    token: {
      decimals: event?.payment_token_decimals,
      eth_price: event?.payment_token_eth_price,
      usd_price: event?.payment_token_usd_price,
    },
  }
}

const mostRecentBidOrOfferPriceData = (events: EventField[] = []) => {
  const most_recent_bid_event = mostRecentEvent(
    events.filter(isBidOrOfferEvent)
  )
  return bidOrOfferPriceData(most_recent_bid_event)
}

const salePriceData = ({
  asset,
  event,
}: {
  asset: AssetProps
  event: EventField
}) => {
  if (event === null) {
    return saleOrderPrice({ asset })
  }

  return {
    price: event?.total_price ?? event?.ending_price ?? event?.starting_price,
    token: {
      decimals: event?.payment_token_decimals,
      eth_price: event?.payment_token_eth_price,
      usd_price: event?.payment_token_usd_price,
    },
  }
}

const saleOrderPrice = ({ asset }: { asset: AssetProps }) => {
  const current = currentOrderFrom({ asset })
  return {
    price: current?.current_price,
    token: {
      decimals: current?.payment_token_contract?.decimals,
      eth_price: current?.payment_token_contract?.eth_price,
      usd_price: current?.payment_token_contract?.usd_price,
    },
  }
}

const SALE_EVENT_TYPES = ['successful', 'created']
export const isSaleEvent = (event: EventField) =>
  SALE_EVENT_TYPES.includes(event?.event_type)

const mostRecentSalePriceData = ({
  asset,
  events = [],
}: {
  asset: AssetProps
  events: EventField[]
}) => {
  const asset_last_sale = asset?.last_sale
  const most_recent_sale_event = mostRecentEvent(events.filter(isSaleEvent))

  if (most_recent_sale_event) {
    return salePriceData({ asset, event: most_recent_sale_event })
  }

  if (asset_last_sale) {
    return {
      price: asset_last_sale?.total_price,
      token: asset_last_sale?.payment_token,
    }
  }
  return null
}

export const listingPriceData = (event: EventField) => {
  if (event === null || event?.event_type !== 'created') {
    return null
  }
  return {
    price: event?.starting_price ?? event?.ending_price,
    token: {
      decimals: event?.payment_token_decimals,
      eth_price: event?.payment_token_eth_price,
      usd_price: event?.payment_token_usd_price,
    },
  }
}

const mostRecentListingPriceData = (events: EventField[] = []) => {
  const most_recent_listing_event = mostRecentEvent(
    events.filter(e => e?.event_type === 'created')
  )
  return listingPriceData(most_recent_listing_event)
}
