import { Request, Response } from 'express'
import Users from '../models/Users'
import UsersFollowing from '../models/UsersFollowing'
import { keysToCamel } from '../utils'
import configKeys from '../config'
import { uploadFile } from '../services/AWS/s3'
import fs from 'fs'
import util from 'util'

const unlinkFile = util.promisify(fs.unlink)

const addCloudURL = (file: string) => {
  return `${configKeys.CLOUD_FRONT_URL}/${file}`
}

export async function findUsers(req: Request, res: Response) {
  try {
    const { offset = 0, limit = 20, ...query } = req.query
    const users = await Users.findAll({
      where: query,
      offset: parseInt(offset as string, 10),
      limit: parseInt(limit as string, 10),
    })

    const usersResponse = users.map(user =>
      keysToCamel((user as any).dataValues)
    )

    if (req.user) {
      const associationsFollowers = (
        await UsersFollowing.findAll({
          where: { followee_id: (req.user as any).id },
        })
      ).map(v => (v as any).dataValues)

      const associationsFollowees = (
        await UsersFollowing.findAll({
          where: { follower_id: (req.user as any).id },
        })
      ).map(v => (v as any).dataValues)

      usersResponse.forEach(user => {
        user.isFollower =
          associationsFollowers.findIndex(
            (item: any) => item.follower_id === user.id
          ) >= 0
        user.isFollowee =
          associationsFollowees.findIndex(
            (item: any) => item.followee_id === user.id
          ) >= 0
      })
    }
    res.status(200).send(usersResponse)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'something goes wrong' })
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { public_address }: { public_address: string } = req.body
    const user = await Users.create(
      {
        public_address,
        nonce: Math.floor(Math.random() * 1000000),
      },
      {
        fields: ['public_address', 'nonce'],
      }
    )
    res.status(200).json([user])
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Could not create user' })
  }
}

function clean(obj: any) {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]
    }
  }
  return obj
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { public_address } = req.params
    const {
      name,
      username,
      config,
      email,
      nonce,
      bio,
      website,
      twitter,
      instagram,
      discordId,
      youtube,
      facebook,
      tiktok,
      snapchat,
      discord,
    } = req.body

    // CHEQUEAR SI PUBLIC_ADDRESS VACIA O ERRONEA
    if (!public_address) {
      return res.status(404).json({
        message: 'Wrong or unexisting public_address. No update was made',
      })
    }

    // CHECK IF FILES ARA COMMING?!!

    // require files from form
    const file = (req as any).files
    console.log('files', file)

    if (file) {
      const profile_file = file.profile_img_url ? file.profile_img_url[0] : null
      const cover_file = file.cover_img_url ? file.cover_img_url[0] : null

      // upload file to s3
      const result_profile = (await profile_file)
        ? await uploadFile(profile_file)
        : null
      const result_cover = (await cover_file)
        ? await uploadFile(cover_file)
        : null

      const profile_key = result_profile ? result_profile.Key : null
      const cover_key = result_cover ? result_cover.Key : null

      // delete file from server
      if (profile_file != null) {
        await unlinkFile(profile_file.path)
      }
      if (cover_file != null) {
        await unlinkFile(cover_file.path)
      }

      const updateParams: { [key: string]: string } = {
        name,
        username,
        config,
        email,
        nonce,
        bio,
        website,
        twitter,
        instagram,
        discord_id: discordId,
        youtube,
        facebook,
        tiktok,
        snapchat,
        discord,
      }

      if (profile_key) {
        updateParams.profile_img_url = addCloudURL(profile_key)
      }
      if (cover_key) {
        updateParams.cover_img_url = addCloudURL(cover_key)
      }

      const cleanParams = await clean(updateParams)

      const oldUsers = await Users.findOne({
        where: {
          public_address,
        },
      })

      if (oldUsers) {
        Users.update(cleanParams, {
          where: {
            public_address,
          },
        })

        return res.status(200).json({ message: 'User updated succesfully!' })
      } else {
        return res.status(404).send('User not found')
      }
    } else {
      // If no coming FILES
      const updateParams = {
        name,
        username,
        config,
        email,
        nonce,
        bio,
        website,
        twitter,
        instagram,
        discord_id: discordId,
        youtube,
        facebook,
        tiktok,
        snapchat,
        discord,
      }

      const cleanParams = await clean(updateParams)

      const oldUsers = await Users.findOne({
        where: {
          public_address,
        },
      })

      if (oldUsers) {
        Users.update(cleanParams, {
          where: {
            public_address,
          },
        })

        return res.status(200).json({ message: 'User updated succesfully!' })
      } else {
        // otro bloque
        Users.create(
          {
            name,
            username,
            public_address,
            config,
            email,
            nonce,
            bio,
            website,
            twitter,
            instagram,
            discord_id: discordId,
            youtube,
            facebook,
            tiktok,
            snapchat,
            discord,
          },
          {
            fields: [
              'name',
              'username',
              'public_address',
              'config',
              'email',
              'nonce',
              'bio',
              'website',
              'twitter',
              'instagram',
              'discord_id',
              'youtube',
              'facebook',
              'tiktok',
              'snapchat',
              'discord',
            ],
          }
        )
        return res.status(200).json({ message: 'User created succesfully!' })
      }
    }
  } catch (error) {
    console.log('Error at updateUser', error)
    return res.status(500).send('Something went wrong on server-side')
  }
}
