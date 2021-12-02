import { Request, Response } from 'express'
import { keysToCamel } from '../utils'

import Users from '../models/Users'
import UsersFollowing from '../models/UsersFollowing'

export async function createFollow(req: Request, res: Response) {
  const { follower_address, followee_address } = req.params
  try {
    const newFollower = await Users.findOne({
      where: { public_address: follower_address },
    })
    const newFollowee = await Users.findOne({
      where: { public_address: followee_address },
    })

    const newFollowerId =
      newFollower === null ? '' : newFollower.getDataValue('id')
    const newFolloweeId =
      newFollowee === null ? '' : newFollowee.getDataValue('id')
    const newFollowerUserName =
      newFollower === null ? '' : newFollower.getDataValue('username')
    const newFolloweeUserName =
      newFollowee === null ? '' : newFollowee.getDataValue('username')

    if (newFollowerId && newFolloweeId && newFollowerId !== newFolloweeId) {
      const existingFollow = await UsersFollowing.findOne({
        where: { follower_id: newFollowerId, followee_id: newFolloweeId },
      })

      if (existingFollow) {
        res.status(404).json({
          message: 'Cannot create follow/association because it already exists',
        })
        return
      }
      const association = await UsersFollowing.create({
        follower_id: newFollowerId,
        followee_id: newFolloweeId,
      })
      const associationResponse = keysToCamel((association as any).dataValues)
      res.status(200).json({
        message: `Follow/Followee process succesfull. ${newFollowerUserName} now follows ${newFolloweeUserName}`,
        association: associationResponse,
      })
    } else if (
      typeof newFollowerId === 'number' &&
      typeof newFolloweeId === 'number' &&
      newFollowerId === newFolloweeId
    ) {
      const message =
        'Impossible to create follow relation because is not possible for one user to follow itself.'
      console.log(message)
      res.status(404).json({ message, data: {} })
    } else {
      const message =
        'The values passed as follower_address and/or followee_address are wrong.'
      console.log(message)
      res.status(404).json({ message, data: {} })
    }
  } catch (error) {
    console.log('CreateFollow Error:', error)
    res.status(500).json({
      message: 'Something gone wrong creating a Follow',
      data: {},
    })
  }
}

export async function getOneFolloweeByIdWithAllHisFollowers(
  req: Request,
  res: Response
) {
  const { followee_address } = req.params
  const { offset = '0', limit = '20' } = req.query
  try {
    const followeeUserData = await Users.findOne({
      where: {
        public_address: followee_address,
      },
    })
    if (followeeUserData) {
      const usersFollowing = await UsersFollowing.findAll({
        attributes: ['follower_id', 'followee_id'],
        order: [['followee_id', 'DESC']],
        where: { followee_id: followeeUserData.getDataValue('id') },
        offset: parseInt(offset as string, 10),
        limit: parseInt(limit as string, 10),
      })

      const mappedUsersFollowing: number[] = usersFollowing.map(userFollowing =>
        userFollowing.getDataValue('follower_id')
      )

      const followers: any[] = await Promise.all(
        mappedUsersFollowing.map(async (follower_id: any) => {
          const followerResponse = await Users.findAll({
            where: { id: follower_id },
          })
          return followerResponse
        })
      )
      const flatFollowers = followers.reduce(
        (accumulator, value) => accumulator.concat(value),
        []
      )

      const followeeUserDataResponse = keysToCamel(
        (followeeUserData as any).dataValues
      )

      const followersResponse = flatFollowers.map((follower: any) =>
        keysToCamel((follower as any).dataValues)
      )

      const followerState = {
        followeeUserData: followeeUserDataResponse,
        followers: followersResponse,
      }

      res.status(200).json(followerState)
    } else {
      res.status(404).json({
        message:
          "Param followee_address doesn't exist. Make sure to pass an existing profile_address.",
        data: [],
      })
    }
  } catch (error) {
    console.log('Error en Follow:', error)
    res.status(500).send(error)
  }
}

// Get all the people one Follower is Following (followees)
export async function getOneFollowerByIdWithAllHisFollowees(
  req: Request,
  res: Response
) {
  const { follower_address } = req.params
  const { offset = '0', limit = '20' } = req.query
  try {
    const followerUserData = await Users.findOne({
      where: {
        public_address: follower_address,
      },
    })
    if (followerUserData) {
      const usersFollowees = await UsersFollowing.findAll({
        attributes: ['follower_id', 'followee_id'],
        order: [['followee_id', 'DESC']],
        where: { follower_id: followerUserData.getDataValue('id') },
        offset: parseInt(offset as string, 10),
        limit: parseInt(limit as string, 10),
      })

      const mappedUsersFollowee: number[] = usersFollowees.map(usersFollowee =>
        usersFollowee.getDataValue('followee_id')
      )
      const followees: any[] = await Promise.all(
        mappedUsersFollowee.map(async (followee_id: any) => {
          const followeeResponse = await Users.findAll({
            where: { id: followee_id },
          })
          return followeeResponse
        })
      )

      const flatFollowees = followees.reduce(
        (accumulator, value) => accumulator.concat(value),
        []
      )

      const followerUserDataResponse = keysToCamel(
        (followerUserData as any).dataValues
      )

      const followeesResponse = flatFollowees.map((followee: any) =>
        keysToCamel((followee as any).dataValues)
      )

      const followeeState = {
        followerUserData: followerUserDataResponse,
        followees: followeesResponse,
      }
      res.status(200).json(followeeState)
    } else {
      res.status(404).json({
        message:
          "Param follower_address doesn't exist. Make sure to pass an existing profile_address.",
        data: [],
      })
    }
  } catch (error) {
    console.log('getAllFolloweesOfOneFollower error:', error)
    res.status(500).send(error)
  }
}
// DELETE Follow BY artist_ID
export async function unFollow(req: Request, res: Response) {
  try {
    const { follower_address, followee_address } = req.params

    const follower = await Users.findOne({
      where: { public_address: follower_address },
    })
    const followee = await Users.findOne({
      where: { public_address: followee_address },
    })

    const followerId = follower === null ? '' : follower.getDataValue('id')
    const followeeId = followee === null ? '' : followee.getDataValue('id')
    const followerUserName =
      follower === null ? '' : follower.getDataValue('username')
    const followeeUserName =
      followee === null ? '' : followee.getDataValue('username')

    if (followerId && followeeId && followerId !== followeeId) {
      const deletedRowCount = await UsersFollowing.destroy({
        where: {
          follower_id: followerId,
          followee_id: followeeId,
        },
      })
      if (deletedRowCount === 1) {
        res.status(200).json({
          message: `Successfull unfollow: ${followerUserName} unfollowed ${followeeUserName}`,
          count: deletedRowCount,
        })
      } else {
        res.status(404).send({
          message:
            'The follower_address and followee_address exist, but there was no following relation existing so unfollow was unable to succed. This also could happen if you are passing the same profile_address (user being following itself: cannot happen)',
          count: deletedRowCount,
        })
      }
    } else {
      const message =
        'The values passed as follower_address and/or followee_address are wrong.'
      console.log(message)
      res.status(404).send({ message, data: {} })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

export async function checkExistingFollow(req: Request, res: Response) {
  try {
    const { follower_address, followee_address } = req.params

    const checkFollower = await Users.findOne({
      where: { public_address: follower_address },
    })
    const checkFollowee = await Users.findOne({
      where: { public_address: followee_address },
    })

    const checkFollowerId =
      checkFollower === null ? '' : checkFollower.getDataValue('id')
    const checkFolloweeId =
      checkFollowee === null ? '' : checkFollowee.getDataValue('id')

    if (
      typeof checkFollowerId === 'number' &&
      typeof checkFolloweeId === 'number' &&
      checkFollowerId !== checkFolloweeId
    ) {
      const existingFollow = await UsersFollowing.findOne({
        where: { follower_id: checkFollowerId, followee_id: checkFolloweeId },
      })
      if (existingFollow) {
        res.status(200).json({ follow: true })
      } else {
        res.status(200).json({ follow: false })
      }
    } else {
      res.status(404).json({
        message:
          'The values passed as follower_address and/or followee_address are wrong.',
      })
    }
  } catch (error) {
    console.log('Error en checkExistingFollow:', error)
    res.status(500).send(error)
  }
}
