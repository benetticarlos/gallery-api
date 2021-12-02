// 1 ether = 1000000000000000000 wei.
// 0,0029 eth = 2900000000000000 wei
// current_price = wei

// EVENT DATA:
// collection.PAYOUT_ADDRESS  ->  creator address
// SELLER.ADDRESS ->              seller address
// winner_account.address ->      buyer address

async function payment() {
  const creatorAddress = 'collection.payout_address'
  const sellerAddress = 'seller.address'
  const buyerAddress = 'winner_account.address'
  const assetPrice = 'total_price'

  // if (creatorAddress === sellerAddress) {
  //   const royaltyPayment85 = 0.85 * assetPrice
  //   return royaltyPayment85
  // } else {
  //   const royaltyPayment10 = 0.1 * assetPrice
  //   return royaltyPayment10
  // }
}
