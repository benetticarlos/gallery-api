import { priceFromPriceData } from '../../opensea/util'
import {
  GalleryItem,
  HistoryItem,
  HistoryItemEventProps,
  EventProps,
  UserWithName,
} from '../../../types'

// Public

export const historyItemsFrom = ({
  galleryItem,
  hydratedAsset,
}: {
  galleryItem: GalleryItem
  hydratedAsset: any
}): HistoryItem[] =>
  (hydratedAsset?.events ?? []).map((event: EventProps) =>
    historyItemFrom({ galleryItem, event })
  )

// Private

const historyItemEventPropsByOpenSeaEventProps = {
  approve: HistoryItemEventProps.approved,
  transfer: HistoryItemEventProps.transferred,
  created: HistoryItemEventProps.listed,
  offer_entered: HistoryItemEventProps.offer_placed,
  cancelled: HistoryItemEventProps.unlisted,
  successful: HistoryItemEventProps.sold,

  // TODO: fix these
  bid_entered: HistoryItemEventProps.none,
  bid_withdraw: HistoryItemEventProps.none,
  payout: HistoryItemEventProps.none,
  composition_created: HistoryItemEventProps.none,
  custom: HistoryItemEventProps.none,
}

const historyItemEventPropsFrom = ({
  event: { event_type },
}: {
  event: EventProps
}) => {
  const historyItemEventProps =
    historyItemEventPropsByOpenSeaEventProps[event_type]
  if (historyItemEventProps === HistoryItemEventProps.none) {
    return null
  }
  return historyItemEventProps ?? null
}

const listingPriceData = (event: EventProps) => {
  if (event === null || event?.event_type !== 'created') {
    return null
  }
  return {
    price: event?.starting_price ?? event?.ending_price,
    token: event?.payment_token,
  }
}

const BID_EVENT_TYPES = ['bid_entered', 'offer_entered']
const isBidOrOfferEvent = (event: EventProps) =>
  BID_EVENT_TYPES.includes(event?.event_type)

const priceDataFrom = ({
  galleryItem,
  event,
  historyItemEventProps,
}: {
  galleryItem: GalleryItem
  event: EventProps
  historyItemEventProps: HistoryItemEventProps
}) => {
  if (event?.event_type === 'created') {
    return listingPriceData(event)
  }
  // bid_entered, offer_entered
  if (isBidOrOfferEvent(event)) {
    return { price: event?.bid_amount, token: event?.payment_token }
  }
  if (event?.event_type === 'successful') {
    return { price: event?.total_price, token: event?.payment_token }
  }
  return null
}

const historyItemFrom = ({
  galleryItem,
  event,
}: {
  galleryItem: GalleryItem
  event: EventProps
}): HistoryItem => {
  const historyItemEventProps = historyItemEventPropsFrom({ event })
  const from_account = event?.from_account ?? event?.transaction?.from_account
  const to_account = event?.to_account ?? event?.transaction?.to_account
  const { price, token } =
    priceDataFrom({
      galleryItem,
      event,
      historyItemEventProps,
    }) ?? {}
  const { price_eth, price_usd } = priceFromPriceData({ price, token }) ?? {}
  return {
    galleryItemAssetId: galleryItem?.assetId,
    galleryItemAssetContractAddress: galleryItem?.assetContractAddress,
    galleryItemAssetTokenId: galleryItem?.assetTokenId,

    timestamp: event?.created_date ?? event?.transaction?.timestamp,

    eventFromAddress: from_account?.address,
    eventFromUsername: (from_account?.user as UserWithName)?.username,
    eventFromImageUrl: from_account?.profile_img_url,

    eventToAddress: to_account?.address,
    eventToUsername: (to_account?.user as UserWithName)?.username,
    eventToImageUrl: to_account?.profile_img_url,

    eventType: historyItemEventProps,

    amountEth: price_eth === null ? null : price_eth.toString(),
    amountUsd: price_usd === null ? null : price_usd.toString(),

    txHash: event?.transaction?.transaction_hash,
  }
}
