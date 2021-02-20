import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Casing } from '../../models/casing'

const router = express.Router()

router.get(
  '/api/parts/casing/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const casing = await Casing.findById(id)
      .populate('motherboardFromFactor')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')
      .populate({
        path: 'itemInfo',
        model: 'Items',
        populate: [
          {
            path: 'manufacturer',
            model: 'Manufacturer',
          },
          {
            path: 'itemCode',
            model: 'ItemCode',
          },
          {
            path: 'itemImages',
            model: 'Images',
          },
          {
            path: 'itemType',
            model: 'ItemType',
          },
        ],
      })
      .exec()

    if (!casing) {
      throw new NotFoundError()
    }

    res.send(casing)
  }
)

export { router as ShowCasingRouter }
