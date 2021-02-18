import {
  NotFoundError,
  requireAuth,
  validateRequest,
  Colors,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { ItemCode } from '../../models/item-code'

const router = express.Router()

router.patch(
  '/api/parts/itemcode/:id',
  requireAuth,
  [body('code').notEmpty().withMessage('Code must be defined')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code } = req.body
    const { id } = req.params

    const codeInfo = await ItemCode.findById(id)

    if (!codeInfo) {
      throw new NotFoundError()
    }

    codeInfo.set({
      code,
    })

    await codeInfo.save()

    res.send(codeInfo)
  }
)

export { router as EditItemCodeRouter }
