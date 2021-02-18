import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Memory } from '../../models/memory'
import { MemoryType } from '../../models/memory-type'
import { MemorySpeed } from '../../models/memory-speed'
import { mandatoryItemRequimentsBodyChecker } from '../../utils/custom-function-extension'
import { Manufacturer } from '../../models/manufacturer'
import { ItemCode } from '../../models/item-code'
import { Images } from '../../models/images'

const router = express.Router()

router.patch(
  '/api/parts/memory/:id',
  requireAuth,
  [
    body('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Memory name must be define'),
    body('memorySpeed')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Memory speed must be array of string'),
    body('memoryType')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Memory type must be string'),
    body('module')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Memory module must be string'),
    body('timing')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Memory timing must be string'),
    body('casLatency')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('CAS latency must be numeric'),
    body('pricePerGb')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('Price per GB must be numeric'),
    body('voltage')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('Memory voltage must be numeric'),
    body('heatSpreader')
      .optional()
      .isBoolean()
      .notEmpty()
      .withMessage('Memory heat spreader must be boolean'),
    body('publish')
      .optional()
      .isBoolean()
      .notEmpty()
      .withMessage('Publish spreader must be boolean'),
    ...mandatoryItemRequimentsBodyChecker,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const {
      name,
      memorySpeed,
      memoryType,
      module,
      timing,
      casLatency,
      pricePerGb,
      voltage,
      heatSpreader,
      manufacturer,
      itemCode,
      itemImages,
      measurements,
      publish,
    } = req.body

    const memoryDoesExist = await Memory.findById(id)

    if (!memoryDoesExist) {
      throw new NotFoundError()
    }
    const isAlreadyExist = await Memory.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) memoryDoesExist.set({ name })
    if (module) memoryDoesExist.set({ module })
    if (timing) memoryDoesExist.set({ timing })
    if (casLatency) memoryDoesExist.set({ casLatency })
    if (pricePerGb) memoryDoesExist.set({ pricePerGb })
    if (voltage) memoryDoesExist.set({ voltage })
    if (typeof heatSpreader === 'boolean') memoryDoesExist.set({ heatSpreader })
    if (measurements) memoryDoesExist.set({ measurements })
    if (typeof publish === 'boolean') memoryDoesExist.set({ publish })

    if (memoryType) {
      const memoryTypeIsAlreadyExist = await MemoryType.findOne({
        name: memoryType,
      })

      if (memoryTypeIsAlreadyExist) {
        memoryDoesExist.memoryType = memoryTypeIsAlreadyExist
      } else {
        const newMemoryType = MemoryType.build({
          name: memoryType,
        })

        await newMemoryType.save()
        memoryDoesExist.memoryType = newMemoryType
      }
    }

    if (memorySpeed) {
      let mspeedIsAlreadyExist = await MemorySpeed.findOne({
        name: memorySpeed,
      })

      if (mspeedIsAlreadyExist) {
        memoryDoesExist.memorySpeed = mspeedIsAlreadyExist
      } else {
        let newMemorySpeed = MemorySpeed.build({
          name: memorySpeed,
        })

        await newMemorySpeed.save()

        memoryDoesExist.memorySpeed = newMemorySpeed
      }
    }

    if (manufacturer) {
      const manufacturerIsAlreadyExist = await Manufacturer.findOne({
        name: manufacturer.name,
      })

      if (manufacturerIsAlreadyExist) {
        memoryDoesExist.manufacturer = manufacturerIsAlreadyExist
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        memoryDoesExist.manufacturer = newManufacturer
      }
    }

    if (itemCode) {
      memoryDoesExist.set({ itemCode: [] })

      for (let code of itemCode) {
        const itemCodeIsAlreadyExist = await ItemCode.findOne({
          code: code,
        })

        if (itemCodeIsAlreadyExist) {
          memoryDoesExist.itemCode.addToSet(itemCodeIsAlreadyExist)
        } else {
          const newItemCode = ItemCode.build({
            code: code,
          })

          await newItemCode.save()
          memoryDoesExist.itemCode.addToSet(newItemCode)
        }
      }
    }

    if (itemImages) {
      memoryDoesExist.set({ itemImages: [] })

      for (let itemImage of itemImages) {
        let itemImageIsAlreadyExist = await Images.findOne({
          name: itemImage.name,
          url: itemImage.url,
        })

        if (itemImageIsAlreadyExist) {
          memoryDoesExist.itemImages?.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          memoryDoesExist.itemImages?.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    await memoryDoesExist.save()

    await memoryDoesExist
      .populate('memorySpeed')
      .populate('memoryType')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')
      .execPopulate()

    res.status(200).send(memoryDoesExist)
  }
)

export { router as EditMemoryRouter }
