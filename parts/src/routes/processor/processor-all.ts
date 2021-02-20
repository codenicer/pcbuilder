import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Processor } from '../../models/processor'
import { pageQueryChecker } from '../../utils/page-query-checker'

const router = express.Router()

router.get(
  '/api/parts/processor/',
  requireAuth,
  async (req: Request, res: Response) => {
    const { page } = req.query

    const checkedPage = pageQueryChecker(page as string)

    const processors = await Processor.paginate(
      {},
      {
        page: checkedPage,
        populate: [
          'series',
          'caches',
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

    res.send(processors)
  }
)

export { router as AllProcessorRouter }
