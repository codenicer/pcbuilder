import {
  requireAuth,
  validateRequest,
  Colors,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Color } from '../../models/colors'

const router = express.Router()

router.post(
  '/api/parts/color',
  requireAuth,
  [body('color').notEmpty().withMessage('You must provide a color')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { color } = req.body

    if (!Object.values(Colors).includes(color)) {
      throw new BadRequestError('Invalid color')
    }

    const colorAlreadyExist = await Color.findOne({
      color,
    })

    if (colorAlreadyExist) {
      throw new BadRequestError('Color is already exist')
    }

    const newColor = Color.build({
      color,
    })
    await newColor.save()

    res.status(201).send(newColor)
  }
)

export { router as NewColorRouter }
