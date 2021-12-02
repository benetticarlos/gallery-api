import { Request } from 'express'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import { to } from 'await-to-js'
import Users from '../../models/Users'
import utils from '../utils'
import config from '../../config'

export const strategy = () => {
  const strategyOptions = {
    jwtFromRequest: (req: Request) => req.cookies.jwt,
    secretOrKey: config.JWT_SECRET,
    passReqToCallback: true,
  }

  const verifyCallback = async (
    req: Request,
    jwtPayload: any,
    cb: Function
  ) => {
    const [err, user] = await to(
      Users.findOne({ where: { id: jwtPayload.data.id } })
    )
    if (err) {
      return cb(err)
    }
    req.user = user
    return cb(null, user)
  }

  passport.use(new passportJWT.Strategy(strategyOptions, verifyCallback))
}

export const login = (req: Request, user: any) => {
  return new Promise((resolve, reject) => {
    req.login(user, { session: false }, err => {
      if (err) {
        return reject(err)
      }
      return resolve(utils.signToken(user))
    })
  })
}
