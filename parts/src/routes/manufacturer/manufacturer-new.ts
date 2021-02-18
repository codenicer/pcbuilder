import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Manufacturer } from '../../models/manufacturer'

const router = express.Router()

router.post(
  '/api/parts/manufacturer',
  requireAuth,
  [body('name').notEmpty().withMessage('Manufacturer name must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, info } = req.body

    const alreadyExist = await Manufacturer.findOne({
      name,
    })

    if (alreadyExist) {
      throw new BadRequestError('Name is already in used')
    }

    const manufacturer = Manufacturer.build({
      name,
    })

    if (info) {
      manufacturer.set({
        info,
      })
    }

    await manufacturer.save()

    res.status(201).send(manufacturer)
  }
)

export { router as NewManufacturerRouter }
