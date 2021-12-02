import { Request, Response } from 'express'

import Playlists from '../models/Playlists'
import PlaylistsArtworks from '../models/PlaylistsArtworks'
import Users from '../models/Users'
import Artworks from '../models/Artworks'
import { keysToCamel } from '../utils'

export async function createPlaylist(req: Request, res: Response) {
  try {
    const { user_address } = req.params
    const { title, description } = req.body
    // Validate body
    if (!title || !description) {
      return res.status(404).json({
        message:
          'The playlist could not be created because some title or description are missing in the form',
        data: {},
      })
    }

    const targetUser = await Users.findOne({
      where: { public_address: user_address },
    })

    // Validate param
    if (!targetUser)
      return res.status(404).send('No valid public_address was provided.')

    const targetUserId =
      targetUser === null ? '' : targetUser.getDataValue('id')

    if (targetUserId) {
      const checkExistingPlaylist = await Playlists.findOne({
        where: { user_id: targetUserId, title },
      })
      // Validate no repeting playlist with same title for that User
      if (checkExistingPlaylist) {
        return res.status(404).json({
          message:
            'The playlist could not be created because this user already has a Playlist with the same title.',
          data: {},
        })
      }

      // Think how to retrieve PREVIOUS playlist

      const findPreviousPlaylist = await Playlists.findAll({
        where: {
          user_id: targetUserId,
        },
      })
      const quantityOfPreviousPlaylist = findPreviousPlaylist.length

      if (quantityOfPreviousPlaylist === 0) {
        const newPlaylists = await Playlists.create(
          {
            title,
            description,
            user_id: targetUserId,
            user_address,
            priority: 1,
          },
          {
            fields: [
              'title',
              'description',
              'user_id',
              'user_address',
              'priority',
            ],
          }
        )
        const responseNewPlaylist = keysToCamel(
          (newPlaylists as any).dataValues
        )
        if (newPlaylists) {
          return res.status(200).json({
            message: `Playlist '${title}' created succesfully for user_address ${user_address}`,
            data: responseNewPlaylist,
          })
        }
      } else {
        const newPlaylists = await Playlists.create(
          {
            title,
            description,
            user_id: targetUserId,
            user_address,
            priority: quantityOfPreviousPlaylist + 1,
          },
          {
            fields: [
              'title',
              'description',
              'user_id',
              'user_address',
              'priority',
            ],
          }
        )

        const responseNewPlaylist = keysToCamel(
          (newPlaylists as any).dataValues
        )
        if (newPlaylists) {
          return res.status(200).json({
            message: `Playlist '${title}' created succesfully for user_address ${user_address}`,
            data: responseNewPlaylist,
          })
        }
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Something gone wrong creating a Playlist',
      data: {},
    })
  }
}

export async function getPlaylists(req: Request, res: Response) {
  const { user_address, offset = 0, limit = 20 } = req.query
  const query = user_address ? { user_address } : {}
  try {
    const playlists = await Playlists.findAll({
      where: query,
      offset: parseInt(offset as string, 10),
      limit: parseInt(limit as string, 10),
    })

    // Get all
    const allPlaylistIds: any[] = playlists.map((playlist: any) =>
      playlist.getDataValue('id')
    )

    // Search all the existing associations for all Playlists.
    const allAssociationsArtworks: any[] = await Promise.all(
      allPlaylistIds.map(async (playlistId: number) => {
        const associationResponse = await PlaylistsArtworks.findAll({
          where: {
            playlist_id: playlistId,
          },
        })
        return associationResponse
      })
    )

    const flatArtworks = allAssociationsArtworks.reduce(
      (accumulator, value) => accumulator.concat(value),
      []
    )
    // Filter only first artwork, which is determined by priority 1
    const filterArtworkWithPriority1 = flatArtworks.filter(
      (association: any) => association.priority === 1
    )

    // Transform to camelCase
    const playlistToCamelCase = playlists.map((item: any) =>
      keysToCamel((item as any).dataValues)
    )

    // Evaluate scenario and attach imagePreviewUrl
    for (let i = 0; i < playlistToCamelCase.length; i++) {
      if (playlistToCamelCase[i].hasOwnProperty('imagePreviewUrl')) {
        continue
      } else {
        for (let j = 0; j < filterArtworkWithPriority1.length; j++) {
          if (
            playlistToCamelCase[i].id ===
            filterArtworkWithPriority1[j].playlist_id
          ) {
            async function retrieveImagePreview() {
              const artworkImage = await Artworks.findOne({
                attributes: ['image_preview_url'],
                where: {
                  id: filterArtworkWithPriority1[j].artwork_id,
                },
              })
              return artworkImage
            }
            const { image_preview_url } = await (retrieveImagePreview() as any)
            playlistToCamelCase[i].imagePreviewUrl = image_preview_url
            break
          } else {
            playlistToCamelCase[i].imagePreviewUrl = null
          }
        }
      }
    }

    return res.status(200).send(playlistToCamelCase)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Something gone wrong getting all the  Playlists',
      data: {},
    })
  }
}

// READ / GET 1 by ID
export async function getOnePlaylistByIdWithRelatedArtworks(
  req: Request,
  res: Response
) {
  try {
    const { playlist_id } = req.params
    const { offset = '0', limit = '20' } = req.query

    const queryPlaylist = await Playlists.findOne({
      where: {
        id: playlist_id,
      },
    })

    if (queryPlaylist) {
      const associations = await PlaylistsArtworks.findAll({
        where: { playlist_id },
        offset: parseInt(offset as string, 10),
        limit: parseInt(limit as string, 10),
      })

      const associationsResponse = associations.map(association =>
        keysToCamel((association as any).dataValues)
      )

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

      const playlistArtworksResponse = flatArtworks.map((artwork: any) =>
        keysToCamel((artwork as any).dataValues)
      )

      playlistArtworksResponse.forEach((artwork: any) => {
        artwork.priority = associationsResponse.find(
          (item: any) => item.artworkId === artwork.id
        ).priority
      })

      const queryPlaylistResponse = keysToCamel(
        (queryPlaylist as any).dataValues
      )

      res.status(200).json({
        queryPlaylist: queryPlaylistResponse,
        relatedArtworks: playlistArtworksResponse,
      })
    } else {
      res.status(404).json({
        message:
          "Query Playlist couldn't be found/doesn't exist. Check existence with getPlaylists controller",
        data: {},
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

// DELETE BY ID
export async function deleteOnePlaylistByIdWithAssociatedArtworks(
  req: Request,
  res: Response
) {
  const { playlist_id } = req.params
  try {
    // Due to violations on foreign key, first I have to delete all associations to that Playlist
    const relatedPlaylistArtworks = await PlaylistsArtworks.findAll({
      where: { playlist_id },
    })

    const targetPlaylist = await Playlists.findOne({
      where: { id: playlist_id },
    })

    const playlistTitle =
      targetPlaylist === null ? '' : targetPlaylist.getDataValue('title')

    if (relatedPlaylistArtworks.length > 0 && playlistTitle) {
      const mappedAssosiations: number[] = relatedPlaylistArtworks.map(
        assosiation => assosiation.getDataValue('id')
      )

      const relatedArtworks: any[] = await Promise.all(
        mappedAssosiations.map(async (playlistId: any) => {
          const playlistArtworksResponse = await PlaylistsArtworks.findAll({
            where: { id: playlistId },
          })
          return playlistArtworksResponse
        })
      )
      const flatArtworks = relatedArtworks.reduce(
        (accumulator, value) => accumulator.concat(value),
        []
      )
      const flatArtworksResponse = flatArtworks.map((artwork: any) =>
        keysToCamel((artwork as any).dataValues)
      )

      const deleteRelatedArtworks: any[] = await Promise.all(
        mappedAssosiations.map(async (playlistId: any) => {
          const playlistArtworksResponse = await PlaylistsArtworks.destroy({
            where: { id: playlistId },
          })
          return playlistArtworksResponse
        })
      )

      const deletePlaylistRowCount = await Playlists.destroy({
        where: { id: playlist_id },
      })

      if (deletePlaylistRowCount === 1 && deleteRelatedArtworks.length > 0) {
        res.status(200).json({
          message: `Playlist '${playlistTitle}' deleted succesfully`,
          deletePlaylistRowCount,
          relatedArtworksRemoved: flatArtworksResponse,
        })
      } else {
        res.status(404).json({
          message: 'No playlist was found',
          deletePlaylistRowCount,
          relatedArtworksRemoved: flatArtworksResponse,
        })
      }
    } else if (!playlistTitle) {
      res.status(404).json({
        message:
          "That Playlist doesn't exist/couldnt be found. Check existence with getPlaylists controller",
        relatedArtworksRemoved: [],
      })
    } else {
      const targetPlaylistToDelete = await Playlists.destroy({
        where: { id: playlist_id },
      })
      res.status(200).json({
        message: `Playlist '${playlistTitle}' deleted succesfully but no relatedArtworksDeleted were associated yet`,
        targetPlaylistToDelete,
        relatedArtworksDeleted: [],
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

// UPDATE BY ID
export async function updateOnePlaylistById(req: Request, res: Response) {
  try {
    const { playlist_id } = req.params
    const { ...values } = req.body

    const targetPlaylist = await Playlists.findOne({
      where: {
        id: playlist_id,
      },
    })
    const playlistTitle =
      targetPlaylist === null ? '' : targetPlaylist.getDataValue('title')

    if (targetPlaylist && playlistTitle) {
      const updatedPlaylist = await targetPlaylist.update({
        ...values,
      })

      const playlistResponse = keysToCamel((targetPlaylist as any).dataValues)

      return res.status(200).json({
        message: `Playlist '${playlistTitle}' updated succesfully`,
        updatedPlaylist: playlistResponse,
      })
    } else {
      res.status(404).json({
        message:
          "No playlist was found/doesn't exist. Check existence with getPlaylists controller",
      })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

export async function updateArtworksPriorities(req: Request, res: Response) {
  try {
    const { playlist_id, artworks_related } = req.body
    // Check existing playlist
    const targetPlaylist = await Playlists.findOne({
      where: { id: playlist_id },
    })

    if (!targetPlaylist)
      return res
        .status(404)
        .send('Playlist id passed is wrong or doesnt exist.')
    const targetPlaylistTitle = !targetPlaylist
      ? null
      : targetPlaylist.getDataValue('title')

    // Check existing associations
    const targetAssociations = await PlaylistsArtworks.findAll({
      where: { playlist_id },
    })
    if (!targetAssociations)
      return res
        .status(404)
        .send(
          'Cannot update artwork priorities becuase this playlist is empty, no artworks associated yet.'
        )
    // Destroy previous associtaions
    const destroyPreviousAssociations = targetAssociations.map(
      async (association: any) => {
        const associationResponse = await PlaylistsArtworks.destroy({
          where: { playlist_id },
        })
      }
    )

    // Add new artworks with their priorities

    const addUpdatedArtworksRelated = artworks_related.map(
      async (artwork: any) => {
        const associateArtworkToPlaylist = await PlaylistsArtworks.create({
          playlist_id,
          artwork_id: Number(artwork.artwork_id),
          priority: Number(artwork.priority),
        })
        return associateArtworkToPlaylist
      }
    )

    return res.status(200).json({
      status: 'Ok',
      message: `Artworks priorities successfully updated to Playlist '${targetPlaylistTitle}'`,
    })
  } catch (error) {
    console.log('Error at updateArtworksPriorities', error)
    res.status(500).send(error)
  }
}

// On Roger request
export async function addArtworkToNewPlaylist(req: Request, res: Response) {
  try {
    const { playlist_id, artworks_related } = req.body

    const targetPlaylist = await Playlists.findOne({
      where: { id: playlist_id },
    })
    const targetPlaylistTitle = !targetPlaylist
      ? null
      : targetPlaylist.getDataValue('title')

    if (!targetPlaylist)
      return res.status(404).send('No playlist found for that playlist_id')

    const mappedArtworksRelated = artworks_related.map(async (artwork: any) => {
      const associateArtworkToPlaylist = await PlaylistsArtworks.create({
        playlist_id,
        artwork_id: Number(artwork.artwork_id),
        priority: Number(artwork.priority),
      })
      return associateArtworkToPlaylist
    })

    return res.status(200).json({
      status: 'Ok',
      message: `Artworks successfully related to Playlist '${targetPlaylistTitle}'`,
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

export async function addArtworkToExistingPlaylist(
  req: Request,
  res: Response
) {
  try {
    const { playlist_id } = req.params
    const { artwork_id } = req.body

    const targetPlaylist = await Playlists.findOne({
      where: {
        id: playlist_id,
      },
    })

    if (!targetPlaylist)
      return res.status(404).send('Invalid or unexisting playlist_id')

    // Check if artwork_id is already related to that Playlist
    const checkExistingAssociation = await PlaylistsArtworks.findOne({
      where: {
        playlist_id,
        artwork_id,
      },
    })

    if (checkExistingAssociation !== null) {
      return res
        .status(404)
        .send(
          'Cannot add this artwork to this playlist because it has been already added!'
        )
    }

    const relatedArtworksPriorities = await PlaylistsArtworks.findAll({
      attributes: ['priority'],
      where: {
        playlist_id,
      },
    })
    // Check if previous artwork exists
    if (relatedArtworksPriorities.length > 0) {
      const currentHighestPriority = Math.max(
        ...relatedArtworksPriorities.map((artwork: any) => artwork.priority)
      )

      const artworkToExistingPlaylist = await PlaylistsArtworks.create({
        playlist_id,
        artwork_id,
        priority: currentHighestPriority + 1,
      })

      return res.status(200).json({
        existingArtworksPriorities: relatedArtworksPriorities,
        addArtworkToExistingPlaylist: artworkToExistingPlaylist,
      })
    } else {
      const firstArtworkToExistingEmptyPlaylist =
        await PlaylistsArtworks.create({
          playlist_id,
          artwork_id,
          priority: 1,
        })

      return res.status(200).json({
        firstArtworkToExistingPlaylist: firstArtworkToExistingEmptyPlaylist,
      })
    }
  } catch (error) {
    console.log('Error at addArtwork', error)
    res.status(500).send(error)
  }
}

// Delete Artwork by ID
export async function deleteArtworkFromPlaylist(req: Request, res: Response) {
  const { playlist_id, artwork_id } = req.params
  try {
    // Check if targetPlaylist exist
    const targetPlaylist = await Playlists.findOne({
      where: { id: playlist_id },
    })
    if (!targetPlaylist)
      return res
        .status(404)
        .send(
          "Cannot find that playlist or doesn't exist. Check existence with getPlaylists controller."
        )
    // Check if artwork exist
    const targetArtwork = await Artworks.findOne({
      where: { id: artwork_id },
    })

    if (!targetArtwork)
      return res
        .status(404)
        .send(
          "Cannot find that artwork or doesn't exist. Check existence with getArtworks controller."
        )

    // Check if artwork ALREADY delated in that playlist
    const checkExistingAssociation = await PlaylistsArtworks.findAll({
      where: { playlist_id, artwork_id },
    })
    if (checkExistingAssociation.length === 0) {
      return res
        .status(404)
        .send(
          "Cannot remove this artwork from this playlist because it's not already included/associated to that Playlist."
        )
    }

    const targetPlaylistId =
      targetPlaylist === null ? '' : targetPlaylist.getDataValue('id')
    const targetArtworkId =
      targetArtwork === null ? '' : targetArtwork.getDataValue('id')
    const targetPlaylistTitle =
      targetPlaylist === null ? '' : targetPlaylist.getDataValue('title')
    const targetArtworkTitle =
      targetArtwork === null ? '' : targetArtwork.getDataValue('title')

    if (targetPlaylistId && targetArtworkId) {
      const deletedRowCount = await PlaylistsArtworks.destroy({
        where: {
          playlist_id,
          artwork_id,
        },
      })
      res.status(200).json({
        message: `Artwork '${targetArtworkTitle}' deleted successfully from Playlist '${targetPlaylistTitle}'`,
        count: deletedRowCount,
      })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}
