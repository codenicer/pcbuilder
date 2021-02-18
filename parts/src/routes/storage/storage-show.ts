import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Storage } from '../../models/storage'

const router = express.Router()

router.get(
  '/api/parts/storage/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const storage = await Storage.findById(id)
      .populate('formFactor')
      .populate('interfaces')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')
      .exec()

    if (!storage) {
      throw new NotFoundError()
    }

    res.send(storage)
  }
)

export { router as ShowStorageRouter }
