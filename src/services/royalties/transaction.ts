import { ethers, utils } from 'ethers'
import { web3Provider } from '../ether'
import { handleSeaportEvents } from '../opensea/handle_seaport_events'

// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(web3Provider)

// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()

export async function transaction(sender: any, receiver: any, strEther: any) {
  console.log(
    transaction(
      (receiver = `${receiver}`),
      (sender = `${sender}`),
      (strEther = `${strEther}`)
    )
  )

  // Acccounts now exposed
  const params = [
    {
      from: sender,
      to: receiver,
      value: ethers.utils.parseUnits(strEther, 'ether').toHexString(),
    },
  ]

  const transactionHash = await provider.send('eth_sendTransaction', params)
  console.log('transactionHash is ' + transactionHash)

  // Get the address of the Signer
  const myAddress = await signer.getAddress()

  // To sign a simple string, which are used for
  // logging into a service, such as CryptoKitties,
  // pass the string in.
  const signature = await signer.signMessage('Hello World')

  // Send 1 ether to an ens name.
  const tx = signer.sendTransaction({
    to: receiver,
    value: ethers.utils.parseEther('1.0'),
  })
}
