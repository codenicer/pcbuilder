import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { OpticalDrive } from '../../models/optical-drive'

const router = express.Router()

router.get(
  '/api/parts/opticaldrive/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const opticalDrive = await OpticalDrive.findById(id)
      .populate('formFactor')
      .populate('interfaces')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')
      .exec()

    if (!opticalDrive) {
      throw new NotFoundError()
    }

    res.send(opticalDrive)
  }
)

export { router as ShowOpticalDriveRouter }
