import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { ItemType } from '../../models/item-types'

const router = express.Router()

router.get(
  '/api/parts/itemtype/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const itemType = await ItemType.findById(id)

    if (!itemType) {
      throw new NotFoundError()
    }

    res.send(itemType)
  }
)

export { router as ShowItemTypeRouter }
