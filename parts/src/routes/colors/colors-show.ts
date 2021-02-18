import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Color } from '../../models/colors'

const router = express.Router()

router.get(
  '/api/parts/color/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const colorInfo = await Color.findById(id)

    if (!colorInfo) {
      throw new NotFoundError()
    }

    res.send(colorInfo)
  }
)

export { router as ShowColorRouter }
