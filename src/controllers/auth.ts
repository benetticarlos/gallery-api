import { to } from 'await-to-js'
import { recoverPersonalSignature } from 'eth-sig-util'
import { bufferToHex } from 'ethereumjs-util'
import { Request, Response, NextFunction } from 'express'
import { login } from '../auth/strategies/jwt'
import Users from '../models/Users'

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  ////////////////////////////////////////////////////
  // Step 1: Get the user with the given public_address
  ////////////////////////////////////////////////////
  const { signature, public_address } = req.body
  if (!signature || !public_address)
    return res
      .status(400)
      .send({ error: 'Request should have signature and public_address' })

  let user = await Users.findOne({ where: { public_address } })

  if (!user) {
    res.status(401).send({
      error: `User with public_address ${public_address} is not found in database`,
    })

    return null
  }

  ////////////////////////////////////////////////////
  // Step 2: Verify digital signature
  ////////////////////////////////////////////////////
  const nonce = user.getDataValue('nonce')
  const msg = `I am signing my one-time nonce: ${nonce}`

  const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'))
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  })

  // The signature verification is successful if the address found with
  // sigUtil.recoverPersonalSignature matches the initial public_address
  if (address.toLowerCase() !== public_address.toLowerCase()) {
    res.status(401).send({
      error: 'Signature verification failed',
    })

    return null
  }

  ////////////////////////////////////////////////////
  // Step 3: Generate a new nonce for the user
  ////////////////////////////////////////////////////
  const newNonce = Math.floor(Math.random() * 10000)
  await Users.update({ nonce: newNonce }, { where: { public_address } })

  ////////////////////////////////////////////////////
  // Step 4: Create JWT
  ////////////////////////////////////////////////////
  if (!user) {
    user = await Users.findOne({ where: { public_address } })
  }
  const [loginErr, token] = await to(login(req, user))

  if (loginErr) {
    console.error('Log in error', loginErr)
    return res
      .status(500)
      .json({ success: false, error: 'Authentication error!' })
  }

  return res
    .cookie('jwt', token, {
      httpOnly: false,
      sameSite: 'none',
      secure: true,
    })
    .status(200)
    .json({
      success: true,
      user,
    })
}
