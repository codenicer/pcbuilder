import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { CpuCooler } from '../../models/cpu-cooler'
import { pageQueryChecker } from '../../utils/page-query-checker'

const router = express.Router()

router.get(
  '/api/parts/cpucooler/',
  requireAuth,
  async (req: Request, res: Response) => {
    const { page } = req.query

    const checkedPage = pageQueryChecker(page as string)

    const cpucooler = await CpuCooler.paginate(
      {},
      {
        page: checkedPage,
        populate: [
          'cpuSocket',
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

    res.send(cpucooler)
  }
)

export { router as AllCpuCoolerRouter }
