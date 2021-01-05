import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { Password } from '../services/password'
import { User } from '../models/user'
import { validateRequest } from '../middlewares/validate-request'
import { BadRequestError } from '../errors/bad-request-error'

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be supplied'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError('Failed to authenticate!')
    }

    const passwordsMatch = await Password.toCompare(existingUser!.password, password)
    if (!passwordsMatch) {
      throw new BadRequestError('Failed to authenticate!')
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    )

    req.session = {
      jwt: userJwt,
    }
    res.status(200).send(existingUser)
  }
)

export { router as signInRouter }
