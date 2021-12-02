import { AssetProps, GalleryItem } from '../../types'
import { getAssets } from '../opensea/core'
import { getArtistAssets } from '../registry'
import { asyncMap } from '../../utils'

import { galleryItemFromAsset, ownerFromAsset } from './item'

// Public

export const profileQuery = async ({
  address,
}: {
  address: string
}): Promise<any> => {
  return {
    ...(await getAccountByAddress(address)),
    createdGalleryItems: await profileCreatedGalleryItemsQuery({ address }),
    ownedGalleryItems: await profileOwnedGalleryItemsQuery({ address }),
    // playlist
    // favorites
  }
}

export const profileAccountQuery = async ({
  address,
}: {
  address: string
}): Promise<any> => {
  const account = await getAccountByAddress(address)

  return {
    address: account?.address,
    username: account?.username,
    profileImageUrl: account?.profileImageUrl,
  }
}

export const profileCreatedGalleryItemsQuery = async ({
  address,
}: {
  address: string
}): Promise<any> =>
  await getCreatedGalleryItemsByArtistAddress(address, { limit: 50 })

export const profileOwnedGalleryItemsQuery = async ({
  address,
}: {
  address: string
}): Promise<any> =>
  await getOwnedGalleryItemsByOwnerAddress(address, { limit: 50 })

// Private

const getAccountByAddress = async (address: string) => {
  const ownedAssets = await getAssets({ owner: address, limit: 1 })
  const account = await ownerFromAsset(ownedAssets[0])

  return {
    address: account?.address,
    username: account?.user?.username,
    profileImageUrl: account?.profile_img_url,
  }
}

const getAssetsForArtistAssets = async (
  artistAssets: AssetProps[],
  queryParams = {}
) => {
  if (artistAssets?.length === 0) {
    return []
  }

  return await getAssets({
    asset_contract_addresses: artistAssets.map(
      obj => obj.asset_contract.address
    ),
    token_ids: artistAssets.map(obj => obj.token_id),
    ...queryParams,
  })
}

const getCreatedGalleryItemsByArtistAddress = async (
  address: string,
  queryParams = {}
): Promise<GalleryItem[]> => {
  const createdArtistAssets = await getArtistAssets(address)
  const createdAssets = await getAssetsForArtistAssets(createdArtistAssets, {
    ...queryParams,
  })

  const createdGalleryItemsByArtistAssets: GalleryItem[] = await Promise.all(
    createdAssets.map(galleryItemFromAsset)
  )

  return createdGalleryItemsByArtistAssets
}

const getOwnedGalleryItemsByOwnerAddress = async (
  address: string,
  queryParams = {}
): Promise<GalleryItem[]> => {
  const ownedAssets = await getAssets({ owner: address, ...queryParams })

  const ownedGalleryItems: GalleryItem[] = await Promise.all(
    ownedAssets.map(galleryItemFromAsset)
  )

  // TODO: gallery service wrapper for this
  return ownedGalleryItems.filter(item => item.ownerAddress === address)
}
