import { requireAuth, validateRequest } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { ItemCode } from '../../models/item-code'

const router = express.Router()

router.post(
  '/api/parts/itemcode',
  requireAuth,
  [body('code').notEmpty().withMessage('Code must be defined')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code } = req.body

    const newItemCode = ItemCode.build({
      code,
    })

    await newItemCode.save()

    res.status(201).send(newItemCode)
  }
)

export { router as NewItemCodeRouter }
