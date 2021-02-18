import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Manufacturer } from '../../models/manufacturer'

const router = express.Router()

router.get(
  '/api/parts/manufacturer/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const manufacturer = await Manufacturer.findById(id)

    if (!manufacturer) {
      throw new NotFoundError()
    }

    res.send(manufacturer)
  }
)

export { router as ShowManufacturerRouter }
