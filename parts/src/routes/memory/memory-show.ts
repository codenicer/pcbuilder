import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Memory } from '../../models/memory'

const router = express.Router()

router.get(
  '/api/parts/memory/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const memory = await Memory.findById(id)
      .populate('memorySpeed')
      .populate('memoryType')
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

    if (!memory) {
      throw new NotFoundError()
    }

    res.send(memory)
  }
)

export { router as ShowMemoryRouter }
