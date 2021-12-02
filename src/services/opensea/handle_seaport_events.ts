import { EventType } from 'opensea-js'
import * as ActionTypes from './index'
import { openSeaPort } from './openseaport'

export function handleSeaportEvents() {
  return async (dispatch: any, getState: any) => {
    openSeaPort.addListener(
      EventType.TransactionCreated,
      ({ transactionHash, event }) => {
        console.info({ transactionHash, event })
        dispatch({
          type: ActionTypes.getMetadataForAsset,
          hash: transactionHash,
        })
      }
    )
    openSeaPort.addListener(
      EventType.TransactionConfirmed,
      ({ transactionHash, event }) => {
        console.info({ transactionHash, event })
        // Only reset your exchange UI if we're finishing an order fulfillment or cancellation
        if (
          event === EventType.MatchOrders ||
          event === EventType.CancelOrder
        ) {
          // dispatch({ type: ActionTypes.getMetadataForAsset })
          console.log(ActionTypes.getMetadataForAsset)
          return ActionTypes.getMetadataForAsset
        }
      }
    )
    openSeaPort.addListener(
      EventType.TransactionDenied,
      ({ transactionHash, event }) => {
        console.info({ transactionHash, event })
        // dispatch({ type: ActionTypes.getMetadataForAsset })
        console.log(ActionTypes.getMetadataForAsset)
        return ActionTypes.getMetadataForAsset
      }
    )
    openSeaPort.addListener(
      EventType.TransactionFailed,
      ({ transactionHash, event }) => {
        console.info({ transactionHash, event })
        // dispatch({ type: ActionTypes.getMetadataForAsset })
        console.log(ActionTypes.getMetadataForAsset)
        return ActionTypes.getMetadataForAsset
      }
    )
  }
}
