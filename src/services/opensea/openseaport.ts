import { OpenSeaPort, Network } from 'opensea-js'
import { web3Provider } from '../ether'

export const openSeaPort = new OpenSeaPort(web3Provider, {
  networkName: Network.Main,
})
