import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { PowerSupply } from '../../models/power-supply'

const router = express.Router()

router.get(
  '/api/parts/powersupply/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const powersupply = await PowerSupply.findById(id)
      .populate('formFactor')
      .populate('psuConnectors')
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

    if (!powersupply) {
      throw new NotFoundError()
    }

    res.send(powersupply)
  }
)

export { router as ShowPowerSupplyRouter }
