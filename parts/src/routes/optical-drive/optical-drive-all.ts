import { requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { OpticalDrive } from '../../models/optical-drive'
import { pageQueryChecker } from '../../utils/page-query-checker'

const router = express.Router()

router.get(
  '/api/parts/opticaldrive/',
  requireAuth,
  async (req: Request, res: Response) => {
    const { page } = req.query

    const checkedPage = pageQueryChecker(page as string)

    const opticalDrive = await OpticalDrive.paginate(
      {},
      {
        page: checkedPage,
        populate: [
          'formFactor',
          'interfaces',
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

    res.send(opticalDrive)
  }
)

export { router as AllOpticalDriveRouter }
