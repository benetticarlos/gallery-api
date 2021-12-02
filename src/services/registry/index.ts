import Artworks from '../../models/Artworks'
import { AssetProps } from '../../types'

export const getArtistAssets = async (
  artistWalletAddress: string
): Promise<AssetProps[]> => {
  // Artworks.findAll({
  //   where: {
  //     artist_wallet_address: artistWalletAddress,
  //   },
  // })
  return []
}
