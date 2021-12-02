import { Request, Response } from 'express'

import Artworks from '../models/Artworks'
import Users from '../models/Users'
import FavoritesArtworks from '../models/FavoritesArtworks'
import { keysToCamel } from '../utils'

export async function createAssociationFavoritesArtworks(
  req: Request,
  res: Response
) {
  try {
    const { public_address, asset_id } = req.params
    const { priority = 1 } = req.body

    const targetUser = await Users.findOne({
      where: { public_address },
    })
    const targetArtwork = await Artworks.findOne({
      where: { asset_id },
    })
    // Check existing user and artwork
    const targetUserId =
      targetUser === null ? '' : targetUser.getDataValue('id')
    const targetUserName =
      targetUser === null ? '' : targetUser.getDataValue('username')
    const targetArtworkId =
      targetArtwork === null ? '' : targetArtwork.getDataValue('id')
    const targetArtworkTitle =
      targetArtwork === null ? '' : targetArtwork.getDataValue('title')

    if (targetUserId && targetArtworkId) {
      // Check existing favorite association :
      const checkAssociation = await FavoritesArtworks.findOne({
        where: { user_id: targetUserId, artwork_id: targetArtworkId },
      })

      if (checkAssociation) {
        res.status(404).json({
          message:
            "Cannot add this artworks to user's favorite because it's already added.",
          data: {},
        })
        return
      }

      const newAssociation = await FavoritesArtworks.create(
        {
          user_id: targetUserId,
          user_address: public_address,
          artwork_id: targetArtworkId,
          priority,
        },
        {
          fields: ['user_id', 'user_address', 'artwork_id', 'priority'],
        }
      )
      const favoritesAssociationResponse = keysToCamel(
        (newAssociation as any).dataValues
      )
      console.log('favoritesAssociationResponse:', favoritesAssociationResponse)

      if (newAssociation) {
        return res.status(200).json({
          message: `${targetUserName} add ${targetArtworkTitle} to his/her favorites`,
          data: favoritesAssociationResponse,
        })
      }
    } else {
      res.status(404).json({
        message:
          "public_address and/or asset_id passed doesn't exist/couldn't be found. Check if both exist.",
        data: {},
      })
    }
  } catch (error) {
    console.log('Error create FavoriteArtwork:', error)
    res.status(500).json({
      message: 'Something gone wrong creating a Favorite Artwork',
      data: {},
    })
  }
}

export async function getAllFavoritesArtworksFromOneUserByAddress(
  req: Request,
  res: Response
) {
  try {
    const { public_address } = req.params
    const { offset = '0', limit = '20' } = req.query

    const targetUser = await Users.findOne({
      where: { public_address },
    })

    if (targetUser && req.user) {
      const associations = await FavoritesArtworks.findAll({
        where: { user_id: targetUser.getDataValue('id') },
        offset: parseInt(offset as string, 10),
        limit: parseInt(limit as string, 10),
      })
      const mappedAssosiations: number[] = associations.map(assosiation =>
        assosiation.getDataValue('artwork_id')
      )
      const artworks: any[] = await Promise.all(
        mappedAssosiations.map(async (artwork_id: any) => {
          const artworkResponse = await Artworks.findAll({
            where: { id: artwork_id },
          })
          return artworkResponse
        })
      )

      const flatArtworks = artworks.reduce(
        (accumulator, value) => accumulator.concat(value),
        []
      )

      const favoritesResponse = flatArtworks.map((artwork: any) =>
        keysToCamel((artwork as any).dataValues)
      )
      favoritesResponse.forEach((artwork: any) => {
        artwork.isFavorite = true
      })

      const userResponse = keysToCamel((targetUser as any).dataValues)

      return res.status(200).json({
        user: userResponse,
        favoriteArtworks: favoritesResponse,
      })
    } else {
      res.status(404).json({
        message: 'The public_address doesnt exist/couldnt be found',
        data: {},
      })
    }
  } catch (error) {
    console.log('Error en getFavorites', error)
    res.status(500).send(error)
  }
}

export async function deleteOneFavoriteArtworkFromOneUser(
  req: Request,
  res: Response
) {
  try {
    const { asset_id, public_address } = req.params

    const targetUser = await Users.findOne({
      where: { public_address },
    })
    const targetArtwork = await Artworks.findOne({
      where: { asset_id },
    })
    // Check existing user and artwork
    const targetUserId =
      targetUser === null ? '' : targetUser.getDataValue('id')
    const targetArtworkId =
      targetArtwork === null ? '' : targetArtwork.getDataValue('id')
    const targetUserName =
      targetUser === null ? '' : targetUser.getDataValue('username')
    const targetArtworkTitle =
      targetArtwork === null ? '' : targetArtwork.getDataValue('title')

    if (targetUserId && targetArtworkId) {
      // Check existing favoriteArtwork association:
      const checkExistingFavorite = await FavoritesArtworks.findOne({
        where: { user_id: targetUserId, artwork_id: targetArtworkId },
      })
      if (!checkExistingFavorite) {
        res.status(404).json({
          message: `No deletion of favorite artworks association was made because user '${targetUserName}' doesn't have that artwork '${targetArtworkTitle}' as a favorite.`,
          data: {},
        })
        return
      }
      const deleteRowCount = await FavoritesArtworks.destroy({
        where: {
          artwork_id: targetArtworkId,
          user_id: targetUserId,
        },
      })
      if (deleteRowCount) {
        res.status(200).json({
          message: `Favorite Artwork '${targetArtworkTitle}' deleted succesfully from user '${targetUserName}'`,
          count: deleteRowCount,
        })
      }
    } else {
      res.status(404).json({
        message:
          "asset_id and/or profile_address doesn't exist/couldn't be found.",
      })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

export async function updatePriorityOfOneFavoriteArtwork(
  req: Request,
  res: Response
) {
  try {
    const { asset_id, public_address } = req.params
    const { priority } = req.body

    const targetUser = await Users.findOne({
      where: { public_address },
    })
    const targetArtwork = await Artworks.findOne({
      where: { asset_id },
    })

    const targetFavoriteArtwork = await FavoritesArtworks.findOne({
      attributes: ['id', 'user_id', 'user_address', 'artwork_id', 'priority'],
      where: {
        artwork_id: targetArtwork.getDataValue('id'),
        user_id: targetUser.getDataValue('id'),
      },
    })

    if (Object.keys(targetFavoriteArtwork).length > 0) {
      const targetUpdateAssociation = await targetFavoriteArtwork.update({
        priority,
      })

      res.status(200).json({
        message: 'Favorite Artwork priority updated succesfully',
        targetUpdateAssociation,
      })
    } else {
      const message =
        'The target association/favorite artwork to be updated cannot be found/may not exist.'
      console.log(message)
      res.status(404).send(message)
    }
  } catch (error) {
    console.log('Error en update:', error)
    res.status(500).send(error)
  }
}

export async function checkExistingFavoriteAssociation(
  req: Request,
  res: Response
) {
  try {
    const { public_address, asset_id } = req.params
    // Check existence of user and artwork
    const checkUser = await Users.findOne({
      where: { public_address },
    })
    const checkArtwork = await Artworks.findOne({
      where: { asset_id },
    })

    const checkUserId = checkUser === null ? '' : checkUser.getDataValue('id')
    const checkArtworkId =
      checkArtwork === null ? '' : checkArtwork.getDataValue('id')

    if (
      typeof checkUserId === 'number' &&
      typeof checkArtworkId === 'number' &&
      checkUserId !== checkArtworkId
    ) {
      const existingFavorite = await FavoritesArtworks.findOne({
        where: { user_id: checkUserId, artwork_id: checkArtworkId },
      })

      if (existingFavorite) {
        res.status(200).json({ favorite: true })
      } else {
        res.status(200).json({ favorite: false })
      }
    } else {
      res.status(404).json({
        message:
          "The values passed as profile_address and/or asset_id are wrong, doesn't exist or couldnt be found.",
      })
    }
  } catch (error) {
    console.log('Error en checkExistingFavoriteAssociation', error)
    res.status(500).send(error)
  }
}
