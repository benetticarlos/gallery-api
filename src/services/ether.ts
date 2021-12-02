import { ethers } from 'ethers'

import config from '../config'

import Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'

// This example provider won't let you make transactions, only read-only calls:
export const web3Provider = new Web3.providers.HttpProvider(
  'https://mainnet.infura.io'
)

// export const https_provider = new ethers.providers.InfuraProvider(
//     config.INFURA_HTTPS_ENDPOINT
// )
// export const ws_provider = new ethers.providers.WebSocketProvider(
//     config.INFURA_WSS_ENDPOINT
// )

// export const signer = provider.getSigner()
