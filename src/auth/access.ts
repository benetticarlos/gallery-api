// utils.js
import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import config from '../config'

export const restrictAccess =
  (address_param: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (error, user, info) => {
      if (error) {
        console.log(error)
        return res.status(401).json({
          error,
        })
      }

      // No  auth needed for staging
      if (config.DEVELOPMENT) {
        return next()
      }

      if (req.isAuthenticated()) {
        const address = req.params[address_param] ?? req.body[address_param]
        if (user.public_address === address) {
          return next()
        }
      }

      res.status(401).json({
        error: 'User unauthenticated',
      })
    })(req, res, next)
  }

export const userIdentity =
  () => (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (error, user, info) => {
      if (error) {
        console.log(error)
        return res.status(401).json({
          error,
        })
      }
      if (req.isAuthenticated()) {
        console.log(
          'is authenticated user.public_address:',
          user.public_address
        )
      } else {
        console.log('is NOT Authenticated')
      }

      return next()
    })(req, res, next)
  }
