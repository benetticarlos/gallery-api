import config from '../../config'
import { getEvents } from '../../services/opensea/core'
import { UserWithName } from '../../types'

import Events from '../../models/Events'

let lastDateMillis: number = 0

const getAllEvents = async (
  onFinish: (v: unknown) => void,
  offset = 0,
  limit = 50
) => {
  const events = await getEvents({
    offset,
    limit,
    collection_slug: config.OPENSEA_COLLECTION_SLUG,
  })

  console.log('Events from:', offset, 'to', offset + events.length)

  const eventsResponse = events.map(event => {
    try {
      const eventMap = {
        asset_id: event.asset ? event.asset.id : null,
        asset_token_id: event.asset ? event.asset.token_id : null,
        asset_contract_address: event.asset
          ? event.asset.asset_contract.address
          : null,
        bid_amount: event.bid_amount ? event.bid_amount : null,
        duration: event.duration ? event.duration : null,
        created_date: event.created_date ? event.created_date : null,
        ending_price: event.ending_price ? event.ending_price : null,
        event_type: event.event_type ? event.event_type : null,
        starting_price: event.starting_price ? event.starting_price : null,
        transaction_from_account_address: event.transaction
          ? event.transaction.from_account.address
          : null,
        transaction_from_account_user: !event.transaction
          ? null
          : !event.transaction.from_account
          ? null
          : !event.transaction.from_account.user
          ? null
          : (event.transaction.from_account.user as UserWithName).username,
        transaction_from_account_profile_img_url: event.transaction
          ? event.transaction.from_account.profile_img_url
          : null,
        transaction_to_account_address: event.transaction
          ? event.transaction.to_account.address
          : null,
        transaction_to_account_user: !event.transaction
          ? null
          : !event.transaction.to_account
          ? null
          : !event.transaction.to_account.user
          ? null
          : (event.transaction.to_account.user as UserWithName).username,
        transaction_to_account_profile_img_url: event.transaction
          ? event.transaction.to_account.profile_img_url
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
        total_price: event.total_price ? event.total_price : null,
      }
      return eventMap
    } catch (error) {
      console.log(error)
    }
  })

  eventsResponse.forEach(async obj => {
    if (obj) {
      const findOneEvent = await Events.findOne({
        where: {
          asset_id: obj.asset_id,
          created_date: obj.created_date,
          event_type: obj.event_type,
          transaction_hash: obj.transaction_hash,
        },
      })

      if (!findOneEvent) {
        await Events.findOrCreate({
          where: {
            asset_id: obj.asset_id ? obj.asset_id : null,
            asset_token_id: obj.asset_token_id ? obj.asset_token_id : null,
            asset_contract_address: obj.asset_contract_address
              ? obj.asset_contract_address
              : null,
            bid_amount: obj.bid_amount ? obj.bid_amount : null,
            duration: obj.duration ? obj.duration : null,
            created_date: obj.created_date ? obj.created_date : null,
            ending_price: obj.ending_price ? obj.ending_price : null,
            event_type: obj.event_type ? obj.event_type : null,
            starting_price: obj.starting_price ? obj.starting_price : null,
            transaction_from_account_address:
              obj.transaction_from_account_address
                ? obj.transaction_from_account_address
                : null,
            transaction_from_account_user: obj.transaction_from_account_user
              ? obj.transaction_from_account_user
              : null,
            transaction_from_account_profile_img_url:
              obj.transaction_from_account_profile_img_url
                ? obj.transaction_from_account_profile_img_url
                : null,
            transaction_to_account_address: obj.transaction_to_account_address
              ? obj.transaction_to_account_address
              : null,
            transaction_to_account_user: obj.transaction_to_account_user
              ? obj.transaction_to_account_user
              : null,
            transaction_to_account_profile_img_url:
              obj.transaction_to_account_profile_img_url
                ? obj.transaction_to_account_profile_img_url
                : null,
            transaction_timestamp: obj.transaction_timestamp
              ? obj.transaction_timestamp
              : null,
            transaction_hash: obj.transaction_hash
              ? obj.transaction_hash
              : null,
            payment_token_decimals: obj.payment_token_decimals
              ? obj.payment_token_decimals
              : null,
            payment_token_eth_price: obj.payment_token_eth_price
              ? obj.payment_token_eth_price
              : null,
            payment_token_usd_price: obj.payment_token_usd_price
              ? obj.payment_token_usd_price
              : null,
            total_price: obj.total_price ? obj.total_price : null,
          },
        })
      } else {
        await Events.update(
          {
            asset_id: obj.asset_id ? obj.asset_id : null,
            asset_token_id: obj.asset_token_id ? obj.asset_token_id : null,
            asset_contract_address: obj.asset_contract_address
              ? obj.asset_contract_address
              : null,
            bid_amount: obj.bid_amount ? obj.bid_amount : null,
            duration: obj.duration ? obj.duration : null,
            created_date: obj.created_date ? obj.created_date : null,
            ending_price: obj.ending_price ? obj.ending_price : null,
            event_type: obj.event_type ? obj.event_type : null,
            starting_price: obj.starting_price ? obj.starting_price : null,
            transaction_from_account_address:
              obj.transaction_from_account_address
                ? obj.transaction_from_account_address
                : null,
            transaction_from_account_user: obj.transaction_from_account_user
              ? obj.transaction_from_account_user
              : null,
            transaction_from_account_profile_img_url:
              obj.transaction_from_account_profile_img_url
                ? obj.transaction_from_account_profile_img_url
                : null,
            transaction_to_account_address: obj.transaction_to_account_address
              ? obj.transaction_to_account_address
              : null,
            transaction_to_account_user: obj.transaction_to_account_user
              ? obj.transaction_to_account_user
              : null,
            transaction_to_account_profile_img_url:
              obj.transaction_to_account_profile_img_url
                ? obj.transaction_to_account_profile_img_url
                : null,
            transaction_timestamp: obj.transaction_timestamp
              ? obj.transaction_timestamp
              : null,
            transaction_hash: obj.transaction_hash
              ? obj.transaction_hash
              : null,
            payment_token_decimals: obj.payment_token_decimals
              ? obj.payment_token_decimals
              : null,
            payment_token_eth_price: obj.payment_token_eth_price
              ? obj.payment_token_eth_price
              : null,
            payment_token_usd_price: obj.payment_token_usd_price
              ? obj.payment_token_usd_price
              : null,
            total_price: obj.total_price ? obj.total_price : null,
          },
          {
            where: {
              asset_id: obj.asset_id,
              created_date: obj.created_date,
              event_type: obj.event_type,
              transaction_hash: obj.transaction_hash,
            },
          }
        )
      }

      const eventDate = new Date(obj.created_date)
      const eventDateMillis = eventDate.getTime()
      if (eventDateMillis > lastDateMillis) {
        lastDateMillis = eventDateMillis
      }
    }
  })

  if (events.length >= limit && offset < 10000) {
    setTimeout(() => {
      getAllEvents(onFinish, offset + 50, limit)
    }, 150)
  } else {
    const allEvents = await Events.findAll()
    onFinish(allEvents)
  }
}

export const getAllEventsRecursive = () =>
  new Promise(resolve => {
    getAllEvents(resolve)
  })

export class Main {
  static async getNewEvents(offset = 0, limit = 50) {
    const events = await getEvents({
      offset,
      limit,
      collection_slug: config.OPENSEA_COLLECTION_SLUG,
      occurred_after: lastDateMillis,
    })

    if (events.length >= limit && offset < 10000) {
      setTimeout(() => {
        Main.getNewEvents(offset + 50, limit)
      }, 150)
    }
  }
}
