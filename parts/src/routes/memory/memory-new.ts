import {
  requireAuth,
  validateRequest,
  BadRequestError,
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
import { Items } from '../../models/items'

const router = express.Router()

router.post(
  '/api/parts/memory',
  requireAuth,
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Memory name must be define'),
    body('memorySpeed')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Memory speed must be of string'),
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
    ...mandatoryItemRequimentsBodyChecker,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
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
    } = req.body

    const isAlreadyExist = await Items.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    const newItems = Items.build({
      name,
      measurements,
    })

    if (manufacturer) {
      const manufacturerIsAlreadyExist = await Manufacturer.findOne({
        name: manufacturer.name,
      })

      if (manufacturerIsAlreadyExist) {
        newItems.manufacturer = manufacturerIsAlreadyExist
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        newItems.manufacturer = newManufacturer
      }
    }

    if (itemCode) {
      for (let code of itemCode) {
        const itemCodeIsAlreadyExist = await ItemCode.findOne({
          code: code,
        })

        if (itemCodeIsAlreadyExist) {
          newItems.itemCode.addToSet(itemCodeIsAlreadyExist)
        } else {
          const newItemCode = ItemCode.build({
            code: code,
          })

          await newItemCode.save()
          newItems.itemCode.addToSet(newItemCode)
        }
      }
    }

    if (itemImages) {
      for (let itemImage of itemImages) {
        let itemImageIsAlreadyExist = await Images.findOne({
          name: itemImage.name,
          url: itemImage.url,
        })

        if (itemImageIsAlreadyExist) {
          newItems.itemImages?.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          newItems.itemImages?.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    const memory = Memory.build({
      itemInfo: newItems,
      module,
      timing,
      casLatency,
      pricePerGb,
      voltage,
      heatSpreader,
    })

    if (memoryType) {
      const memoryTypeIsAlreadyExist = await MemoryType.findOne({
        name: memoryType,
      })

      if (memoryTypeIsAlreadyExist) {
        memory.memoryType = memoryTypeIsAlreadyExist
      } else {
        const newMemoryType = MemoryType.build({
          name: memoryType,
        })

        await newMemoryType.save()
        memory.memoryType = newMemoryType
      }
    }

    if (memorySpeed) {
      let mspeedIsAlreadyExist = await MemorySpeed.findOne({
        name: memorySpeed,
      })

      if (mspeedIsAlreadyExist) {
        memory.memorySpeed = mspeedIsAlreadyExist
      } else {
        let newMemorySpeed = MemorySpeed.build({
          name: memorySpeed,
        })

        await newMemorySpeed.save()

        memory.memorySpeed = newMemorySpeed
      }
    }

    await memory.save()
    res.status(201).send(memory)
  }
)

export { router as NewMemoryRouter }
