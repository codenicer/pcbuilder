import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Processor } from '../../models/processor'

const router = express.Router()

router.get(
  '/api/parts/processor/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const processor = await Processor.findById(id)
      .populate('series')
      .populate('caches')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')
      .exec()

    if (!processor) {
      throw new NotFoundError()
    }

    res.send(processor)
  }
)

export { router as ShowProcessorRouter }
