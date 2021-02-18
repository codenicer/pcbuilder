import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { MotherBoard } from '../../models/motherboard'

const router = express.Router()

router.get(
  '/api/parts/motherboard/',
  requireAuth,
  async (req: Request, res: Response) => {
    const { page } = req.query

    let checkedPage = 1

    if (page) {
      if (parseInt(page as string) !== NaN && parseInt(page as string) >= 1) {
        checkedPage = parseInt(page as string)
      }
    }

    const motherboards = await MotherBoard.paginate(
      {},
      {
        page: checkedPage,
        populate: [
          'cpuSocket',
          'formFactor',
          'chipset',
          'memoryType',
          'memorySpeed',
          'pcieSlots',
          'usbSlots',
          'sataSlots',
        ],
      }
    )

    res.send(motherboards)
  }
)

export { router as AllMotherBoardRouter }
