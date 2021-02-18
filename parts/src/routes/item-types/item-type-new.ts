import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { ItemType } from '../../models/item-types'

const router = express.Router()

router.post(
  '/api/parts/itemtype',
  requireAuth,
  [body('name').notEmpty().withMessage('Item type name must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name } = req.body

    const alreadyExist = await ItemType.findOne({
      name,
    })

    if (alreadyExist) {
      throw new BadRequestError('Name is already in used')
    }

    const itemType = ItemType.build({
      name,
    })

    await itemType.save()

    res.status(201).send(itemType)
  }
)

export { router as NewItemTypeRouter }
