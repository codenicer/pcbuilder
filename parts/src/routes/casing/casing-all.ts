import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Casing } from '../../models/casing'

const router = express.Router()

router.get(
  '/api/parts/casing/',
  requireAuth,
  async (req: Request, res: Response) => {
    const { page } = req.query

    let checkedPage = 1

    if (page) {
      if (parseInt(page as string) !== NaN && parseInt(page as string) >= 1) {
        checkedPage = parseInt(page as string)
      }
    }

    const casing = await Casing.paginate(
      {},
      {
        page: checkedPage,
        populate: [
          'motherboardFromFactor',
          'manufacturer',
          'itemCode',
          'itemImages',
          {
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
          },
        ],
      }
    )

    if (!casing) {
      throw new NotFoundError()
    }

    res.send(casing)
  }
)

export { router as AllCasingRouter }
