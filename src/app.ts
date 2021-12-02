// app.ts
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import auth from './auth'
import config from './config'
import routes from './routes'

const app: express.Application = express()

app.enable('trust proxy')

const whitelist = [config.WEB_SITE_URL]
// Cors
const corsOptions = {
  credentials: true,
  origin: (origin: string, callback: Function) => {
    if (whitelist.indexOf(origin) !== -1 || !origin || config.DEVELOPMENT) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

// Adding Passport and initialise Authentication
app.use(passport.initialize())
auth.initialiseAuthentication(app)

// Routes
app.use('/v1', routes)

export default app
