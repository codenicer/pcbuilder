import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { VideoCard } from '../../models/video-card'

const router = express.Router()

router.get(
  '/api/parts/videocard/',
  requireAuth,
  async (req: Request, res: Response) => {
    const { page } = req.query

    let checkedPage = 1

    if (page) {
      if (parseInt(page as string) !== NaN && parseInt(page as string) >= 1) {
        checkedPage = parseInt(page as string)
      }
    }

    const videoCards = await VideoCard.paginate(
      {},
      {
        page: checkedPage,
        populate: [
          'ports',
          'chipset',
          'memoryType',
          'interfaces',
          'sliCrossfireType',
          'manufacturer',
          'itemCode',
          'itemImages',
        ],
      }
    )

    res.send(videoCards)
  }
)

export { router as AllVideoCardRouter }
