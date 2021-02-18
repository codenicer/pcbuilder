import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { ItemCode } from '../../models/item-code'

const router = express.Router()

router.get(
  '/api/parts/itemcode/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const itemCode = await ItemCode.findById(id)

    if (!itemCode) {
      throw new NotFoundError()
    }

    res.send(itemCode)
  }
)

export { router as ShowItemCodeRouter }
