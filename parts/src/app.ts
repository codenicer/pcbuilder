import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@cnpcbuilder/common'

//*main routers
import * as VideoCardRouter from './routes/video-card'
import * as StorageRouter from './routes/storage'
import * as CasingRouter from './routes/casing'
import * as PowerSupplyRouter from './routes/power-supply'
import * as CpuCoolerRouter from './routes/cpu-cooler'
import * as OpticalDriveRouter from './routes/optical-drive'
import * as ProcessorRouter from './routes/processor'
import * as MotherBoardRouter from './routes/motherboard'
import * as MemoryRouter from './routes/memory'

//*sub routers
import * as ManufacturerRouter from './routes/manufacturer'
import * as ItemCodeRouter from './routes/item-codes'
import * as ColorRouter from './routes/colors'
// import { showOrderRouter } from './routes/show';

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)
app.use(currentUser)

//* colors routes
app.use(ColorRouter.EditColorRouter)
app.use(ColorRouter.NewColorRouter)
app.use(ColorRouter.ShowColorRouter)

//* part-code routes
app.use(ItemCodeRouter.EditItemCodeRouter)
app.use(ItemCodeRouter.NewItemCodeRouter)
app.use(ItemCodeRouter.ShowItemCodeRouter)

//* manufacturer routes
app.use(ManufacturerRouter.EditManufacturerRouter)
app.use(ManufacturerRouter.NewManufacturerRouter)
app.use(ManufacturerRouter.ShowManufacturerRouter)

//* motherboard routes
app.use(MotherBoardRouter.NewMotherBoardRouter)
app.use(MotherBoardRouter.ShowMotherBoardRouter)
app.use(MotherBoardRouter.EditMotherboardRouter)
app.use(MotherBoardRouter.AllMotherBoardRouter)

//* videocard routes
app.use(VideoCardRouter.NewVideoCardRouter)
app.use(VideoCardRouter.EditVideoCardRouter)
app.use(VideoCardRouter.ShowVideoCardRouter)
app.use(VideoCardRouter.AllVideoCardRouter)

//*processor routes
app.use(ProcessorRouter.NewProcessorRouter)
app.use(ProcessorRouter.EditProcessorRouter)
app.use(ProcessorRouter.ShowProcessorRouter)
app.use(ProcessorRouter.AllProcessorRouter)

//* memory routes
app.use(MemoryRouter.NewMemoryRouter)
app.use(MemoryRouter.EditMemoryRouter)
app.use(MemoryRouter.ShowMemoryRouter)
app.use(MemoryRouter.AllMemoryRouter)

//* storage routes
app.use(StorageRouter.NewStorageRouter)
app.use(StorageRouter.EditStorageRouter)
app.use(StorageRouter.ShowStorageRouter)
app.use(StorageRouter.AllStorageRouter)

//* casing routes
app.use(CasingRouter.NewCasingRouter)
app.use(CasingRouter.EditCasingRouter)
app.use(CasingRouter.ShowCasingRouter)
app.use(CasingRouter.AllCasingRouter)

//* power supply routes
app.use(PowerSupplyRouter.NewPowerSupplyRouter)
app.use(PowerSupplyRouter.EditPowerSupplyRouter)
app.use(PowerSupplyRouter.ShowPowerSupplyRouter)
app.use(PowerSupplyRouter.AllPowerSupplyRouter)

//* cpu cooler routes
app.use(CpuCoolerRouter.NewCpuCoolerRouter)
app.use(CpuCoolerRouter.EditCpuCoolerRouter)
app.use(CpuCoolerRouter.ShowCpuCoolerRouter)
app.use(CpuCoolerRouter.AllCpuCoolerRouter)

//* optical drive routes
app.use(OpticalDriveRouter.NewOpticalDriveRouter)
app.use(OpticalDriveRouter.EditOpticalDriveRouter)
app.use(OpticalDriveRouter.ShowOpticalDriveRouter)
app.use(OpticalDriveRouter.AllOpticalDriveRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
