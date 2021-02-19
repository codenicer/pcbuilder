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
import { Items } from '../../models/items'

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

    const itemInfo = await Items.findById({
      _id: memoryDoesExist?.itemInfo,
    })

    if (!itemInfo) {
      throw new NotFoundError()
    }

    const isAlreadyExist = await Items.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) itemInfo.set({ name })
    if (module) memoryDoesExist.set({ module })
    if (timing) memoryDoesExist.set({ timing })
    if (casLatency) memoryDoesExist.set({ casLatency })
    if (pricePerGb) memoryDoesExist.set({ pricePerGb })
    if (voltage) memoryDoesExist.set({ voltage })
    if (typeof heatSpreader === 'boolean') memoryDoesExist.set({ heatSpreader })
    if (measurements) itemInfo.set({ measurements })
    if (typeof publish === 'boolean') itemInfo.set({ publish })

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
        itemInfo.manufacturer = manufacturerIsAlreadyExist
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        itemInfo.manufacturer = newManufacturer
      }
    }

    if (itemCode) {
      itemInfo.set({ itemCode: [] })

      for (let code of itemCode) {
        const itemCodeIsAlreadyExist = await ItemCode.findOne({
          code: code,
        })

        if (itemCodeIsAlreadyExist) {
          itemInfo.itemCode.addToSet(itemCodeIsAlreadyExist)
        } else {
          const newItemCode = ItemCode.build({
            code: code,
          })

          await newItemCode.save()
          itemInfo.itemCode.addToSet(newItemCode)
        }
      }
    }

    if (itemImages) {
      itemInfo.set({ itemImages: [] })

      for (let itemImage of itemImages) {
        let itemImageIsAlreadyExist = await Images.findOne({
          name: itemImage.name,
          url: itemImage.url,
        })

        if (itemImageIsAlreadyExist) {
          itemInfo.itemImages?.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          itemInfo.itemImages?.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    await itemInfo.save()
    await memoryDoesExist.save()

    await memoryDoesExist
      .populate('memorySpeed')
      .populate('memoryType')
      .populate({
        path: 'itemInfo',
        model: 'Items',
        populate: [
          {
            path: 'manufacturer',
            model: 'Manufacturer',
          },
          {
            path: 'itemCode',
            model: 'ItemCode',
          },
          {
            path: 'itemImages',
            model: 'Images',
          },
          {
            path: 'itemType',
            model: 'ItemType',
          },
        ],
      })
      .execPopulate()

    res.status(200).send(memoryDoesExist)
  }
)

export { router as EditMemoryRouter }
