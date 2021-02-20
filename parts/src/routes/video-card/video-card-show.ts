import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { VideoCard } from '../../models/video-card'

const router = express.Router()

router.get(
  '/api/parts/videocard/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const videoCard = await VideoCard.findById(id)
      .populate('chipset')
      .populate('memoryType')
      .populate('interfaces')
      .populate('sliCrossfireType')
      .populate('ports')
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

    if (!videoCard) {
      throw new NotFoundError()
    }

    res.send(videoCard)
  }
)

export { router as ShowVideoCardRouter }
