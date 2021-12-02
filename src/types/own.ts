import { EventProps } from '../types'

export type ArtworksProps = {
  id: string
  name: string
  description: string
  assetIPFSPath: string
  assetIPFSPreview: string
  metadataIPFSPath: string
  width: number
  height: number
  duration: Date
  mimeType: string
  mintTxHash: string
  muxStatus: string
  muxMaxResolution: string
  muxPlaybackId: string
  assetId: string
  assetProcessor: string
  assetStatus: string
  muxId: string
  tokenId: number
  status: string
  hiddenAt: string
  deletedAt: string
  moderationStatus: string
  price: string
  creator: CreatorProps
}

export type CreatorProps = {
  userIndex: number
  publicKey: string
  username: string
  profileImageUrl: string
  coverImageUrl: string
  name: string
  bio: string
  isApprovedCreator: boolean
  moderationStatus: string
  joinedWaitlistAt: string
  createdAt: Date
  firstName: string
  lastName: string
  isAdmin: boolean
  followers: number
  following: number
  links: LinksProps
}

export type LinksProps = {
  tiktok: {
    handle: string
    platform: string
  }
  twitch: {
    handle: string
    platform: string
  }
  discord: {
    handle: string
    platform: string
  }
  twitter: {
    handle: string
    platform: string
  }
  website: {
    handle: string
    platform: string
  }
  youtube: {
    handle: string
    platform: string
  }
  facebook: {
    handle: string
    platform: string
  }
  snapchat: {
    handle: string
    platform: string
  }
  instagram: {
    handle: string
    platform: string
  }
}

export enum GalleryItemStatus {
  buy_now = 'buy_now',
  on_auction = 'on_auction',
  none = 'none',
}

export type GalleryItem = {
  // identifiers
  // contract & token reference metadata
  assetId: number
  assetContractAddress: string
  assetTokenId: string

  // core item metadata
  title: string
  description: string

  // media
  imageUrl: string
  videoUrl?: string
  imagePreviewUrl?: string
  imageThumbnailUrl?: string
  imageOriginalUrl?: string

  // creator
  creatorUsername: string
  creatorImageUrl: string
  creatorAddress: string

  // owner
  ownerUsername: string
  ownerImageUrl: string
  ownerAddress: string

  // collection
  collectionSlug: string
  collectionPayoutAddress: string
  collectionName: string
  collectionImageUrl: string

  // status
  status: GalleryItemStatus

  // price
  priceEth?: string
  priceUsd?: string

  // history
  historyItems: HistoryItem[]

  // open offers
  // - offers

  // auction
  expiration: string // iso8601
  // - highest bid
  // - all bids

  isFavorite?: boolean
  is_featured?: boolean

  schemaName: string // 'ERC721' | 'ERC1155'
}

export enum HistoryItemEventProps {
  minted = 'minted',
  approved = 'approved',
  transferred = 'transferred',
  listed = 'listed',
  offer_placed = 'offer_placed',
  unlisted = 'unlisted',
  sold = 'sold',
  none = 'none',
}

export type HistoryItem = {
  galleryItemAssetId: number
  galleryItemAssetContractAddress: string
  galleryItemAssetTokenId: string

  timestamp: string // iso8601

  eventType: HistoryItemEventProps

  amountEth: string
  amountUsd: string

  eventFromAddress: string
  eventFromUsername: string
  eventFromImageUrl: string

  eventToAddress: string
  eventToUsername: string
  eventToImageUrl: string

  txHash: string
}

export type User = {
  // creator and/or collector
  address: string
  username: string
  imageUrl: string
  profileUrl: string
  description?: string
}

export type Account = {
  address: string
  user: User
  profile_img_url: string
}

export type TransactionType = {
  from_account: Account
  to_account: Account
  timestamp: string
  transaction_hash: string
}

export type exhibitionProps = {
  title: string
  description: string
  banner_image_url: string
  image_url: string
  slug: string
  total_supply: number
  num_owners: number
  floor_price: number
  total_volume: number
}

export type QueryType = { [key: string]: string | number }

export type EventMap = { [key: string]: EventProps[] }

export type EventField = {
  id: number
  asset_id: number
  asset_token_id: string
  asset_contract_address: string
  bid_amount: string
  duration: string
  created_date: string
  ending_price: string
  event_type: string
  starting_price: string
  transaction_from_account_address: string
  transaction_from_account_user: string
  transaction_from_account_profile_img_url: string
  transaction_to_account_address: string
  transaction_to_account_user: string
  transaction_to_account_profile_img_url: string
  transaction_timestamp: string
  transaction_hash: string
  payment_token_decimals: number
  payment_token_eth_price: number
  payment_token_usd_price: string
  total_price: string
}
