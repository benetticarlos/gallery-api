import { asyncMap } from './../utils/index';
import { Request, Response } from 'express'

import Exhibitions from '../models/Exhibitions'
import ExhibitionsArtworks from '../models/ExhibitionsArtworks'
import Artworks from '../models/Artworks'
import { keysToCamel } from '../utils'


/* EXHIBITION CONTROLLERS */
// CREATE DATA/NEW EXHIBITION ✔
export async function createExhibition(req: Request, res: Response) {
  const { title, description, priority } = req.body
  try {
    const newExhibition = await Exhibitions.create(
      {
        title,
        description,
        priority,
      },
      {
        fields: ['title', 'description', 'priority'],
      }
    )
    if (newExhibition) {
      return res.status(200).json({
        message: 'Exhibition created succesfully',
        data: newExhibition,
      })
    }
  } catch (error) {
    console.log("Error", error)
    res.status(500).json({
      message: 'Something gone wrong creating a Exhibition',
      data: {},
    })
  }
}

// Get ALL ✔
export async function getAllExhibitions(req: Request, res: Response) {
  try {
    const exhibitions = await Exhibitions.findAll()

    const exhibitionResponse = exhibitions.map((exhibition: any) =>
      keysToCamel((exhibition as any).dataValues)
    )

    res.status(200).json({ status: 'ok', exhibitions: exhibitionResponse })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Something went wrong getting all the Exhibitions',
      exhibitions: [],
    })
  }
}

// READ / GET 1 Exhibition by ID with all assosiated ExhibitionsArtworks and Artworks
export async function getOneExhibitionByIdWithArtworks(req: Request, res: Response) {
  const { exhibition_id } = req.params

  try {
    const exhibition = await Exhibitions.findOne({
      where: {
        id: exhibition_id,
      },
    })
    // Check existing exhibition
    if(!exhibition) return res.status(404).send("No exhibition matched with that id. Make sure that exhibition id exists currently un DB")

    const assosiations = await ExhibitionsArtworks.findAll({
      order: [['id', 'DESC']],
      where: { exhibition_id  },
    })

    const mappedAssosiations: number[] = assosiations.map((assosiation) => assosiation.getDataValue("artwork_id"))

    const artworks: any[] = await Promise.all(
      mappedAssosiations.map(async (artwork_id: any) => {
        const artworkResponse = await Artworks.findAll({
          where: { id: artwork_id },
        })
        return artworkResponse
      })
    )

    const flatArtworks = artworks
      .reduce((accumulator, value) => accumulator.concat(value), [])
      .map((artwork: any) => keysToCamel((artwork as any).dataValues))

    const fullExhibition = {
      exhibition: keysToCamel((exhibition as any).dataValues),
      numberOfArtworks: artworks.length,
      artworks: flatArtworks,
    }

    res.status(200).json(fullExhibition)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

// DELETE BY ID
export async function deleteOneExhibition(req: Request, res: Response) {
  const { exhibition_id } = req.params
  try {
    const deleteRowCount = await Exhibitions.destroy({
      where: {
        id: exhibition_id,
      },
    })
    await ExhibitionsArtworks.destroy({
      where: { exhibition_id },
    })
    res.status(200).send({
      message: 'Exhibition deleted succesfully',
      count: deleteRowCount,
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

// UPDATE BY ID
export async function updateOneExhibition(req: Request, res: Response) {
  try {
    const { exhibition_id } = req.params
    const { title, description, priority } = req.body

    const exhibitions = await Exhibitions.findAll({
      attributes: [
        'title',
        'description',
        'priority',
        'id'
      ],
      where: {
        id: exhibition_id,
      },
    })
    if (exhibitions.length > 0) {
      exhibitions.forEach(async (exhibition: any) => {
        await exhibition.update({
          title,
          description,
          priority,
          id: exhibition_id
        })
      })
    }

    return res.status(200).json({
      message: 'Exhibition updated succesfully',
      data: exhibitions,
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

// *****************************************************
/*EXHIBITIONARTWORKS CONTROLLERS */
// Assosiate Artwork to Exhibition at ExhibitionArtwork table.
export async function addAssociationToExhibitionArtworks(req: Request, res: Response) {
  try {
    // 1) Paso el id de un artwork y otro de exhibition por params.
    const {
      exhibition_id,
      artwork_id,
      priority
    } = req.body

    const newAssociation = await ExhibitionsArtworks.findOrCreate({
      where: {
        exhibition_id,
        artwork_id,
        priority,
      }
    })

    res.status(200).json({
      message: 'New Artwork related to ExhibitionArtworks created at BDD',
      newRegistry: newAssociation,
    })

  } catch (error) {
    res.status(500).send(error)
  }
}


// Delete Artwork by ID
export async function deleteAssociationFromExhibitionArtworks(req: Request, res: Response) {
  const { association_id } = req.params
  try {
    const deletedRowCount = await ExhibitionsArtworks.destroy({
      where: {
        id: association_id,
      },
    })
    res.status(200).json({
      message: 'Artwork deleted',
      count: deletedRowCount,
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

// Update Association
export async function updateAssociationFromExhibitionArtworks(req: Request, res: Response) {
  const { association_id  } = req.params
  try {
    const { exhibition_id, artwork_id, priority } = req.body

    const targetAssociation = await ExhibitionsArtworks.findOne({
      attributes: ['id', 'exhibition_id', 'artwork_id', 'priority'],
      where: {
        id: association_id,
      },
    })
    const updatedAssociation = await ExhibitionsArtworks.update(
      {
        exhibition_id,
        artwork_id,
        priority,
      },
      {
        where: {
          id: association_id,
        },
      }
    )
    res.status(200).json({
      message: 'Association updated',
      updatedData: updatedAssociation,
      previousData: targetAssociation,
    })
  } catch (error) {
    res.status(500).send(error)
  }
}
