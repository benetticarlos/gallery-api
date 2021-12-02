import { Request, Response } from 'express'

export default {
  index: async (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', msg: 'Hello!' })
  },
}
