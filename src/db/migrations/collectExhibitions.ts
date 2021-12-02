import { getCollectionsFromAccount } from '../../services/opensea/core'
import Artworks from '../../models/Artworks'
import Exhibitions from '../../models/Exhibitions'
import ExhibitionsArtworks from '../../models/ExhibitionsArtworks'
import { getAssetsByCollectionSlug } from '../../services/opensea'
import { UserWithName, CollectionProps, exhibitionProps } from '../../types'

const getSlugArray = async () => {
  const AccountCollections = await getCollectionsFromAccount()

  const collectionsAccountSlug = AccountCollections.map(obj => {
    const slug = { slug: `${obj.slug}` }
    return slug
  })

  const slugArr: string[] = []
  collectionsAccountSlug.forEach(element => {
    slugArr.push(element.slug)
  })
  return slugArr
}

const getExhibitionInfo = async () => {
  const AccountCollections = await getCollectionsFromAccount()
  const collectionsData = AccountCollections.map((obj: CollectionProps) => {
    const data = {
      title: obj.name,
      description: obj.description,
      banner_image_url: obj.banner_image_url,
      image_url: obj.image_url,
      slug: obj.slug,
      total_supply: obj.stats.total_supply,
      num_owners: obj.stats.num_owners,
      floor_price: obj.stats.floor_price,
      total_volume: obj.stats.total_volume,
    }
    return data
  })

  const createExhibition = async (element: exhibitionProps) => {
    const exhibitionsOut = ['ens']
    if (exhibitionsOut.includes(element.slug)) {
      console.log('exhibition: ----', element.title, '---- was removed from DB')
    }
    const checkSlugInExhibition = await Exhibitions.findOne({
      where: {
        slug: element.slug,
      },
    })
    if (!checkSlugInExhibition && !exhibitionsOut.includes(element.slug)) {
      await Exhibitions.findOrCreate({
        where: {
          title: element.title,
          description: element.description,
          banner_image_url: element.banner_image_url,
          image_url: element.image_url,
          slug: element.slug,
          total_supply: element.total_supply,
          num_owners: element.num_owners,
          floor_price: element.floor_price,
          total_volume: element.total_volume,
        },
      })
    }
  }

  const promises = collectionsData.map(value => createExhibition(value))

  await Promise.all(promises)

  return collectionsData
}

const getAllCollection = async (
  arr: string[],
  onFinish: (v: unknown) => void,
  i: number = 0
) => {
  let arrayWhitoutSC = arr.map(item => {
    if (item !== 'Account-gallery-nifty') {
      return item
    }
  })

  arrayWhitoutSC = arrayWhitoutSC.filter(dato => {
    return dato !== undefined
  })
  const slug = arrayWhitoutSC[i]
  try {
    const addCollectionOnDB = async (
      collectionName: string,
      finishFunction: (v: unknown) => void
    ) => {
      const collection_slug = collectionName
      const collection = await getAssetsByCollectionSlug(
        {
          order_by: 'pk',
          order_direction: 'desc',
        },
        collection_slug
      )

      console.log('items from:', collection_slug, 'collection')

      const dataFilterFromSlug = collection.map(obj => {
        const data = {
          asset_id: obj.id ? obj.id : null,
          asset_contract_address: obj.asset_contract
            ? obj.asset_contract.address
            : null,
          asset_token_id: obj.token_id ? obj.token_id : null,
          title: obj.name ? obj.name : null,
          description: obj.description ? obj.description : null,
          image_url: obj.image_url ? obj.image_url : null,
          image_preview_url: obj.image_preview_url
            ? obj.image_preview_url
            : null,
          image_thumbnail_url: obj.image_thumbnail_url
            ? obj.image_thumbnail_url
            : null,
          image_original_url: obj.image_original_url
            ? obj.image_original_url
            : null,
          video_url: obj.animation_url ? obj.animation_url : null,
          creator_username: !obj.creator
            ? null
            : !obj.creator.user
            ? null
            : (obj.creator.user as UserWithName).username
            ? null
            : (obj.creator.user as UserWithName).username,
          creator_image_url: obj.creator ? obj.creator.profile_img_url : null,
          creator_address: obj.creator ? obj.creator.address : null,
          owner_username: !obj.owner
            ? null
            : !obj.owner.user
            ? null
            : !(obj.owner.user as UserWithName).username
            ? null
            : (obj.owner.user as UserWithName).username,
          owner_image_url: obj.owner ? obj.owner.profile_img_url : null,
          owner_address: obj.owner ? obj.owner.address : null,
          collection_slug: obj.collection ? obj.collection.slug : null,
          collection_payout_address: obj.collection
            ? obj.collection.payout_address
            : null,
          collection_name: obj.collection ? obj.collection.name : null,
          collection_image_url: obj.collection
            ? obj.collection.image_url
            : null,
          price_eth: !obj.last_sale
            ? null
            : !obj.payment_token
            ? null
            : obj.payment_token.eth_price,
          price_usd: !obj.last_sale
            ? null
            : !obj.payment_token
            ? null
            : obj.payment_token.usd_price,
          expiration: obj.sell_orders
            ? obj.sell_orders[0]?.expiration_time
            : null,

          collection_banner_image_url: !obj.collection
            ? null
            : obj.collection.banner_image_url,
          collection_description: !obj.collection
            ? null
            : obj.collection.description,
          collection_total_supply: obj.stats ? obj.stats.total_supply : null,
          collection_num_owners: obj.stats ? obj.stats.num_owners : null,
          collection_floor_price: obj.stats ? obj.stats.floor_price : null,
          collection_total_volume: obj.stats ? obj.stats.total_volume : null,
        }

        return data
      })

      dataFilterFromSlug.forEach(async obj => {
        await Artworks.findOrCreate({
          where: {
            asset_id: obj.asset_id ? obj.asset_id : null,
            asset_contract_address: obj.asset_contract_address
              ? obj.asset_contract_address
              : null,
            asset_token_id: obj.asset_token_id ? obj.asset_token_id : null,
            title: obj.title ? obj.title : null,
            description: obj.description ? obj.description : null,
            image_url: obj.image_url ? obj.image_url : null,
            image_preview_url: obj.image_preview_url
              ? obj.image_preview_url
              : null,
            image_thumbnail_url: obj.image_thumbnail_url
              ? obj.image_thumbnail_url
              : null,
            image_original_url: obj.image_original_url
              ? obj.image_original_url
              : null,
            video_url: obj.video_url ? obj.video_url : null,
            creator_username: obj.creator_username
              ? obj.creator_username
              : null,
            creator_image_url: obj.creator_image_url
              ? obj.creator_image_url
              : null,
            creator_address: obj.creator_address ? obj.creator_address : null,
            owner_username: obj.owner_username ? obj.owner_username : null,
            owner_image_url: obj.owner_image_url ? obj.owner_image_url : null,
            owner_address: obj.owner_address ? obj.owner_address : null,
            collection_slug: obj.collection_slug ? obj.collection_slug : null,
            collection_payout_address: obj.collection_payout_address
              ? obj.collection_payout_address
              : null,
            collection_name: obj.collection_name ? obj.collection_name : null,
            collection_image_url: obj.collection_image_url
              ? obj.collection_image_url
              : null,
            price_eth: obj.price_eth ? obj.price_eth : null,
            price_usd: obj.price_usd ? obj.price_usd : null,
            expiration: obj.expiration ? obj.expiration : null,
          },
        })
      })
    }

    addCollectionOnDB(slug, onFinish)

    if (i < arrayWhitoutSC.length - 1) {
      getAllCollection(arr, onFinish, i + 1)
    } else {
      onFinish(getAllCollection)
    }
  } catch (error) {
    console.log(error)
  }
}

const relatedExhibitionArtworks = async (arr: string[]) => {
  arr.forEach(async element => {
    const allSlugsExhibitions = await Exhibitions.findAll({
      where: {
        slug: element,
      },
    })

    allSlugsExhibitions.map(async (x: any) => {
      const idExhibition = await x.dataValues.id

      const allSlugsArtworks = await Artworks.findAll({
        where: {
          collection_slug: element,
        },
      })

      const allIdArtworks = allSlugsArtworks.map(async (artwork: any) => {
        const idArtwork = await artwork.dataValues.id
        return idArtwork
      })

      allIdArtworks.forEach(async artworkId => {
        await ExhibitionsArtworks.findOrCreate({
          where: {
            exhibition_id: idExhibition,
            artwork_id: await artworkId,
          },
        })
      })
    })
  })
}

export const getAllCollectionsRecursive = async () => {
  const arrParam = await getSlugArray()
  await getCollectionPromise(arrParam)
  await getExhibitionInfo()
  await relatedExhibitionArtworks(arrParam)
}

const getCollectionPromise = async (arr: string[]) => {
  await new Promise(resolve => {
    getAllCollection(arr, resolve)
  })
}
