import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { CpuCooler } from '../../models/cpu-cooler'
import { CpuSocket } from '../../models/cpu-socket'
import { Images } from '../../models/images'
import { ItemCode } from '../../models/item-code'
import { Items } from '../../models/items'
import { Manufacturer } from '../../models/manufacturer'
import {
  checkMinMax,
  mandatoryItemRequimentsBodyChecker,
  validateArrayOfStrings,
} from '../../utils/custom-function-extension'

const router = express.Router()

router.patch(
  '/api/parts/cpucooler/:id',
  requireAuth,
  [
    body('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Cpu cooler name must be define'),
    body('cpuSocket')
      .optional()
      .isArray()
      .custom(validateArrayOfStrings)
      .withMessage('Cpu socket must be array of string'),
    body('coolerModel')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Cooler model name must be define'),
    body('bearing')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Cooler model name must be define'),
    body('fanRpm')
      .optional()
      .notEmpty()
      .custom(checkMinMax)
      .withMessage('Fan rpm must be object with min and max key'),
    body('noiceLevel')
      .optional()
      .notEmpty()
      .custom(checkMinMax)
      .withMessage('Noice level must be object with min and max key'),
    body('waterCooled')
      .optional()
      .isBoolean()
      .notEmpty()
      .withMessage('Water cooled must be boolean'),
    body('fanless')
      .optional()
      .isBoolean()
      .notEmpty()
      .withMessage('Water cooled must be boolean'),
    body('publish')
      .optional()
      .isBoolean()
      .withMessage('Publish must be boolean'),
    ...mandatoryItemRequimentsBodyChecker,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      cpuSocket,
      coolerModel,
      fanRpm,
      noiceLevel,
      bearing,
      waterCooled,
      fanless,
      manufacturer,
      itemCode,
      itemImages,
      measurements,
      publish,
    } = req.body

    const { id } = req.params

    const cpuCooler = await CpuCooler.findById(id)

    if (!cpuCooler) {
      throw new NotFoundError()
    }
    const itemInfo = await Items.findById({
      _id: cpuCooler?.itemInfo,
    })

    if (!itemInfo) {
      throw new NotFoundError()
    }

    const isAlreadyExist = await Items.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) itemInfo.set({ name })
    if (coolerModel) cpuCooler.set({ coolerModel })
    if (fanRpm) cpuCooler.set({ fanRpm })
    if (bearing) cpuCooler.set({ bearing })
    if (noiceLevel) cpuCooler.set({ noiceLevel })
    if (measurements) itemInfo.set({ measurements })
    if (typeof waterCooled === 'boolean') cpuCooler.set({ waterCooled })
    if (typeof fanless === 'boolean') cpuCooler.set({ fanless })
    if (typeof publish === 'boolean') itemInfo.set({ publish })

    if (cpuSocket) {
      cpuCooler.set({ cpuSocket: [] })

      for (let socket of cpuSocket) {
        let socketIsAlreadyExist = await CpuSocket.findOne({
          name: socket,
        })

        if (socketIsAlreadyExist) {
          cpuCooler.cpuSocket?.addToSet(socketIsAlreadyExist)
        } else {
          let newCpuSocket = CpuSocket.build({
            name: socket,
          })

          await newCpuSocket.save()

          cpuCooler.cpuSocket?.addToSet(newCpuSocket)
        }
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
    await cpuCooler.save()
    await cpuCooler
      .populate('cpuSocket')
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

    res.status(200).send(cpuCooler)
  }
)

export { router as EditCpuCoolerRouter }
