import {
  NotFoundError,
  requireAuth,
  validateRequest,
  Colors,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Manufacturer } from '../../models/manufacturer'

const router = express.Router()

router.patch(
  '/api/parts/manufacturer/:id',
  requireAuth,
  [body('name').notEmpty().withMessage('Manufacturer name must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, info } = req.body
    const { id } = req.params

    const nameIsAlreadyInUse = await Manufacturer.findOne({
      name,
    })

    if (nameIsAlreadyInUse) {
      throw new BadRequestError('Name is already in used')
    }

    const manufacturer = await Manufacturer.findById(id)

    if (!manufacturer) {
      throw new NotFoundError()
    }

    manufacturer.set({
      name,
    })

    if (info) {
      manufacturer.set({
        info,
      })
    }

    await manufacturer.save()

    res.send(manufacturer)
  }
)

export { router as EditManufacturerRouter }
