import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { validateRequest, BadRequestError } from '@cnpcbuilder/common'

import { Password } from '../services/password'
import { User } from '../models/user'

const router = express.Router()
router.post(
  '/api/users/signin',
  [
    body('username')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('username must be between 4 to 20 characters'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],

  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body

    const existingUser = await User.findOne({ username })
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials')
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    )
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    )

    // Store it on session object
    req.session = {
      jwt: userJwt,
    }

    res.status(200).send(existingUser)
  }
)

export { router as signinRouter }
