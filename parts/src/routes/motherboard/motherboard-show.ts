import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { MotherBoard } from '../../models/motherboard'

const router = express.Router()

router.get(
  '/api/parts/motherboard/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const motherboard = await MotherBoard.findById(id)
      .populate('cpuSocket')
      .populate('formFactor')
      .populate('chipset')
      .populate('memoryType')
      .populate('memorySpeed')
      .populate('pcieSlots')
      .populate('usbSlots')
      .populate('sataSlots')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')
      .exec()

    if (!motherboard) {
      throw new NotFoundError()
    }

    res.send(motherboard)
  }
)

export { router as ShowMotherBoardRouter }
