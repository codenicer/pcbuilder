import { requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { ItemType } from '../../models/item-types'

const router = express.Router()

router.get(
  '/api/parts/itemtype',
  requireAuth,
  async (req: Request, res: Response) => {
    const itemType = await ItemType.find()

    res.send(itemType)
  }
)

export { router as AllItemTypeRouter }
