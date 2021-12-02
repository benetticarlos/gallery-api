export type CollectionStatsProps = {
  one_day_volume: number
  one_day_change: number
  one_day_sales: number
  one_day_average_price: number
  seven_day_volume: number
  seven_day_change: number
  seven_day_sales: number
  seven_day_average_price: number
  thirty_day_volume: number
  thirty_day_change: number
  thirty_day_sales: number
  thirty_day_average_price: number
  total_volume: number
  total_sales: number
  total_supply: number
  count: number
  num_owners: number
  average_price: number
  num_reports: number
  market_cap: number
  floor_price: number
}

export type CollectionDisplayDataProps = {
  card_display_style: string
  images?: any[]
}

export type StatsProps = {
  one_day_volume: number
  one_day_change: number
  one_day_sales: number
  one_day_average_price: number
  seven_day_volume: number
  seven_day_change: number
  seven_day_sales: number
  seven_day_average_price: number
  thirty_day_volume: number
  thirty_day_change: number
  thirty_day_sales: number
  thirty_day_average_price: number
  total_volume: number
  total_sales: number
  total_supply: number
  count: number
  num_owners: number
  average_price: number
  num_reports: number
  market_cap: number
  floor_price: number
}

export type PaymentTokensProps = {
  id?: number
  symbol?: string
  address?: string
  image_url?: string
  name?: string
  decimals: number
  eth_price: string | number
  usd_price: string | number
}

export type feePaymentEventProps = {
  asset: string
  asset_bundle: string
  event_type: string
  event_timestamp: string
  auction_type: string
  total_price: string | number
}

export type CollectionProps = {
  primary_asset_contracts?: any[]
  traits?: {}
  stats?: CollectionStatsProps
  banner_image_url?: string
  chat_url?: string
  /**  This string represents the date in UTC */
  created_date: string
  default_to_fiat: boolean
  description: string
  dev_buyer_fee_basis_points: string
  dev_seller_fee_basis_points: string
  discord_url?: string
  display_data: CollectionDisplayDataProps
  external_url?: string
  featured: boolean
  featured_image_url?: string
  hidden: boolean
  safelist_request_status: string
  image_url?: string
  is_subject_to_whitelist: boolean
  large_image_url?: string
  medium_username?: string
  name: string
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: string
  opensea_seller_fee_basis_points: string
  payout_address?: string
  require_email: boolean
  short_description?: string
  slug: string
  telegram_url?: string
  twitter_username?: string
  instagram_username?: string
  wiki_url?: string
  payment_tokens?: PaymentTokensProps[]
}

type AssetContractProps = {
  address: string
  asset_contract_type: string
  created_date: string
  name: string
  nft_version?: string
  opensea_version: string
  owner: number
  schema_name: string
  symbol: string
  total_supply?: string
  description?: string
  external_link?: string
  image_url?: string
  default_to_fiat: boolean
  dev_buyer_fee_basis_points: number
  dev_seller_fee_basis_points: number
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: number
  opensea_seller_fee_basis_points: number
  buyer_fee_basis_points: number
  seller_fee_basis_points: number
  payout_address?: string
}

export type UserWithName = {
  username: string
}

export type AssetUserProps = {
  user: UserWithName | number
  profile_img_url: string
  address: string
  config: string
  discord_id: string
}

type AssetTraitProps = {
  trait_type: string
  value: string
  display_type?: string
  max_value?: string
  trait_count: number
  order?: string
}

export type SellOrderProps = {
  id?: number
  asset?: AssetProps
  asset_bundle?: string
  /**  This string represents the date in UTC */
  created_date: string
  /**  This string represents the date in UTC */
  closing_date?: string
  closing_extendable: boolean
  expiration_time: number
  listing_time: number
  order_hash: string
  metadata: {
    asset: {
      address: string
      id: string
      quantity?: string
    }
    schema: string
    referrerAddress?: string
  }
  exchange: string
  maker: AssetUserProps
  taker: AssetUserProps
  current_price: string
  current_bounty: string
  bounty_multiple: string
  maker_relayer_fee: string
  taker_relayer_fee: string
  maker_protocol_fee: string
  taker_protocol_fee: string
  maker_referrer_fee: string
  fee_recipient: AssetUserProps
  fee_method: number
  side: number
  sale_kind: number
  target: string
  how_to_call: number
  calldata: string
  replacement_pattern: string
  static_target: string
  static_extradata: string
  payment_token: string
  payment_token_contract: {
    id: number
    symbol: string
    address: string
    image_url: string
    name: string
    decimals: number
    eth_price: string | number
    usd_price: string | number
  }
  base_price: string
  extra: string
  quantity: string
  salt: string
  v: number
  r: string
  s: string
  approved_on_chain: boolean
  cancelled: boolean
  finalized: boolean
  marked_invalid: boolean
  prefixed_hash: string
}

type OwnerShipProps = {
  owner: AssetUserProps
  quantity: string
}

export type AssetProps = {
  id: number
  token_id: string
  num_sales: number
  background_color?: string
  image_url: string
  image_preview_url: string
  image_thumbnail_url: string
  image_original_url?: string
  animation_url?: string
  animation_original_url?: string
  name: string
  description: string
  external_link?: string
  asset_contract: AssetContractProps
  permalink: string
  collection: CollectionProps
  decimals?: number
  token_metadata?: string
  owner: AssetUserProps
  sell_orders?: SellOrderProps[]
  creator?: AssetUserProps
  traits?: AssetTraitProps[]
  last_sale?: EventProps
  top_bid?: string
  listing_date?: string
  is_presale?: boolean
  transfer_fee_payment_token?: string
  transfer_fee?: string
  related_assets?: any[]
  orders?: SellOrderProps[]
  auctions?: any[]
  supports_wyvern?: boolean
  top_ownerships?: OwnerShipProps[]
  ownership?: OwnerShipProps
  highest_buyer_commitment?: any
  payment_token?: PaymentTokensProps
  stats?: StatsProps
}

export type UserProps = {
  collection?: CollectionProps[]
  username: string
  publicKey: string
  profile_img_url: string
  bannerImageUrl: string
}

export type bundleProps = {
  maker?: CollectionProps[]
  username: string
  publicKey: string
  profile_img_url: string
  bannerImageUrl: string
}

// https://projectopensea.github.io/opensea-js/enums/asseteventtype.html
export type EventPropss =
  | 'approve'
  | 'transfer'
  | 'created'
  | 'bid_entered'
  | 'bid_withdraw'
  | 'offer_entered'
  | 'cancelled'
  | 'successful'
  | 'payout'
  | 'composition_created'
  | 'custom'

export type EventProps = {
  approved_account?: string
  asset: AssetProps
  permalink?: string
  collection?: CollectionProps
  decimals?: number
  token_metadata?: string
  owner?: UserProps
  asset_bundle?: bundleProps
  auction_type?: string
  bid_amount: string
  collection_slug: string
  contract_address: string
  created_date: string
  custom_event_name?: string
  dev_fee_payment_event?: feePaymentEventProps
  duration?: number | string
  ending_price?: string
  event_type: EventPropss
  from_account: AssetUserProps
  id: number
  owner_account?: string
  payment_token: PaymentTokensProps
  quantity: string
  seller?: AssetUserProps
  starting_price?: string
  to_account?: AssetUserProps
  total_price?: string
  transaction?: {
    from_account: AssetUserProps
    to_account: AssetUserProps
    timestamp: string
    transaction_hash: string
  }
  winner_account?: AssetUserProps
}
