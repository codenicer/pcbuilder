import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { CpuCooler } from '../../models/cpu-cooler'

const router = express.Router()

router.get(
  '/api/parts/cpucooler/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const cpucooler = await CpuCooler.findById(id)
      .populate('cpuSocket')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')
      .exec()

    if (!cpucooler) {
      throw new NotFoundError()
    }

    res.send(cpucooler)
  }
)

export { router as ShowCpuCoolerRouter }
