import {
  NotFoundError,
  requireAuth,
  validateRequest,
  Colors,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Color } from '../../models/colors'

const router = express.Router()
//* patch

router.patch(
  '/api/parts/color/:id',
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

    const { id } = req.params

    const colorInfo = await Color.findById(id)

    if (!colorInfo) {
      throw new NotFoundError()
    }

    colorInfo.set({
      color,
    })

    await colorInfo.save()

    res.send(colorInfo)
  }
)

export { router as EditColorRouter }
