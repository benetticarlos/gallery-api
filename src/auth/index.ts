import utils from './utils'
import strategies from './strategies'

const pipe =
  (...functions: any[]) =>
  (args: any) =>
    functions.reduce((arg, fn) => fn(arg), args)

const initialiseAuthentication = (app: any) => {
  utils.setup()

  pipe(strategies.JWTStrategy)(app)
}
export default { utils, initialiseAuthentication, strategies }
