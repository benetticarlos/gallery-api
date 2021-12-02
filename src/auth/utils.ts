import passport from 'passport'
import jwt from 'jsonwebtoken'
import { to } from 'await-to-js'
import Users from '../models/Users'
import config from '../config'

const setup = () => {
  passport.serializeUser((user: any, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    const [err, user] = await to(Users.findOne({ where: { id } }))
    return done(err, user)
  })
}

const signToken = (user: any) => {
  return jwt.sign({ data: user }, config.JWT_SECRET, {
    expiresIn: 604800,
  })
}

export default { setup, signToken }
