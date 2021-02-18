import { requireAuth } from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { Storage } from '../../models/storage'
import { pageQueryChecker } from '../../utils/page-query-checker'

const router = express.Router()

router.get(
  '/api/parts/storage/',
  requireAuth,
  async (req: Request, res: Response) => {
    const { page } = req.query

    const checkedPage = pageQueryChecker(page as string)

    const storage = await Storage.paginate(
      {},
      {
        page: checkedPage,
        populate: [
          'formFactor',
          'interfaces',
          'manufacturer',
          'itemCode',
          'itemImages',
        ],
      }
    )

    res.send(storage)
  }
)

export { router as AllStorageRouter }
