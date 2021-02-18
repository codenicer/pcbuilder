import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { validateRequest, BadRequestError } from '@cnpcbuilder/common'

import { User } from '../models/user'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage(
        'Password must be between 4 and 20 characters and no spaces'
      ),
    body('username')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Username is must be between 4 and 20 characters'),
    body('firstName')
      .isString()
      .isLength({ min: 4, max: 20 })
      .withMessage('First name is must be between 4 and 20 characters'),
    body('middleName')
      .isString()
      .isLength({ min: 4, max: 20 })
      .withMessage('Middle name is must be between 4 and 20 characters'),
    body('lastName')
      .isString()
      .isLength({ min: 4, max: 20 })
      .withMessage('Last name is must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      username,
      firstName,
      middleName,
      lastName,
    } = req.body

    const existingEmail = await User.findOne({ email })

    if (existingEmail) {
      throw new BadRequestError('Email is in use')
    }

    const existingUsername = await User.findOne({ username })

    if (existingUsername) {
      throw new BadRequestError('Username is in use')
    }

    const user = User.build({
      email,
      password,
      username,
      firstName,
      middleName,
      lastName,
    })
    await user.save()

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    )

    // Store it on session object
    req.session = {
      jwt: userJwt,
    }

    res.status(201).send(user)
  }
)

export { router as signupRouter }
