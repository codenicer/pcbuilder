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
        populate: ['cpuSocket', 'manufacturer', 'itemCode', 'itemImages'],
      }
    )

    res.send(cpucooler)
  }
)

export { router as AllCpuCoolerRouter }
