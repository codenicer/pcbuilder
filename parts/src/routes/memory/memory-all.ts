import { NotFoundError, requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Memory } from '../../models/memory'

const router = express.Router()

router.get(
  '/api/parts/memory/',
  requireAuth,
  async (req: Request, res: Response) => {
    const { page } = req.query

    let checkedPage = 1

    if (page) {
      if (parseInt(page as string) !== NaN && parseInt(page as string) >= 1) {
        checkedPage = parseInt(page as string)
      }
    }

    const memory = await Memory.paginate(
      {},
      {
        page: checkedPage,
        populate: [
          'memorySpeed',
          'manufacturer',
          'memoryType',
          'itemCode',
          'itemImages',
        ],
      }
    )

    res.send(memory)
  }
)

export { router as AllMemoryRouter }
