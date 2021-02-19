import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Processor } from '../../models/processor'

const router = express.Router()

router.get(
  '/api/parts/processor/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const processor = await Processor.findById(id)
      .populate('series')
      .populate('caches')
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

    if (!processor) {
      throw new NotFoundError()
    }

    res.send(processor)
  }
)

export { router as ShowProcessorRouter }
