import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { PowerSupply } from '../../models/power-supply'
import { pageQueryChecker } from '../../utils/page-query-checker'

const router = express.Router()

router.get(
  '/api/parts/powersupply/',
  requireAuth,
  async (req: Request, res: Response) => {
    const { page } = req.query

    const checkedPage = pageQueryChecker(page as string)

    const powersupply = await PowerSupply.paginate(
      {},
      {
        page: checkedPage,
        populate: [
          'formFactor',
          'psuConnectors',
          'manufacturer',
          'itemCode',
          'itemImages',
        ],
      }
    )

    res.send(powersupply)
  }
)

export { router as AllPowerSupplyRouter }
