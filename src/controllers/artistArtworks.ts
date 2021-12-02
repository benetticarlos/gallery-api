import { Request, Response } from 'express'

import UsersFollowing from '../models/UsersFollowing'

import Artworks from '../models/Artworks'

// add one artwork
export async function addArtworkForArtist(req: Request, res: Response) {
  const { artist_wallet_address, asset_contract_address, asset_token_id } =
    req.body
  try {
    const newArtistAsset = await Artworks.create(
      {
        artist_wallet_address,
        asset_contract_address,
        asset_token_id,
      },
      {
        fields: [
          'artist_wallet_address',
          'asset_contract_address',
          'asset_token_id',
        ],
      }
    )
    if (newArtistAsset) {
      return res.json({
        message: 'artist asset created successfully',
        data: newArtistAsset,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'something goes wrong' })
  }
}
// get one specific artwork
export async function getOneArtwork(req: Request, res: Response) {
  const { asset_contract_address, asset_token_id } = req.params
  const oneArtwork = await Artworks.findOne({
    where: {
      asset_contract_address,
      asset_token_id,
    },
  })
  res.json({
    data: oneArtwork,
  })
}
// get all artworks from one artist or all artworks if the query is empty
export async function getArtworks(req: Request, res: Response) {
  const { artist_wallet_address } = req.params
  const { offset = '0', limit = '20' } = req.query
  const query = artist_wallet_address ? { artist_wallet_address } : {}
  const artworks = await Artworks.findAll({
    where: query,
    offset: parseInt(offset as string, 10),
    limit: parseInt(limit as string, 10),
  })
  res.json({
    data: artworks,
  })
}
// delete one specific artwork
export async function deleteArtwork(req: Request, res: Response) {
  const { asset_contract_address, asset_token_id } = req.params
  const deleteRowCount = await Artworks.destroy({
    where: {
      asset_contract_address,
      asset_token_id,
    },
  })
  res.json({
    message: 'artwork deleted successfully',
  })
}

/*  artworks with their Follows */

export async function getOneArtWorkWithOwnFollows(req: Request, res: Response) {
  const { artist_id } = req.params
  const { offset = '0', limit = '20' } = req.query
  try {
    const queryArtworks = await Artworks.findOne({
      where: {
        id: artist_id,
      },
    })
    const follows = await UsersFollowing.findAll({
      attributes: ['user_name', 'artist_name', 'artist_id'],
      order: [['id', 'DESC']],
      where: { artist_id },
      offset: parseInt(offset as string, 10),
      limit: parseInt(limit as string, 10),
    })
    const artworkWithFollowers = {
      ...queryArtworks,
      follows,
    }
    res.status(200).json(artworkWithFollowers)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

