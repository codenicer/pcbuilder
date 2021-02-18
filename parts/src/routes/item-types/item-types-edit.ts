import {
  NotFoundError,
  requireAuth,
  validateRequest,
  Colors,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { ItemType } from '../../models/item-types'

const router = express.Router()

router.patch(
  '/api/parts/itemtype/:id',
  requireAuth,
  [body('name').notEmpty().withMessage('Item type name must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name } = req.body
    const { id } = req.params

    const nameIsAlreadyInUse = await ItemType.findOne({
      name,
    })

    if (nameIsAlreadyInUse) {
      throw new BadRequestError('Name is already in used')
    }

    const itemType = await ItemType.findById(id)

    if (!itemType) {
      throw new NotFoundError()
    }

    itemType.set({
      name,
    })

    await itemType.save()

    res.send(itemType)
  }
)

export { router as EditItemTypeRouter }
