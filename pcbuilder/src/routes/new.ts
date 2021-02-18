import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'

const router = express.Router()

router.get('/api/pcbuilder/new', async (req: Request, res: Response) => {
  res.send({ msg: 'welcome from pcbuilder service' })
})

export { router as NewRouterTest }
