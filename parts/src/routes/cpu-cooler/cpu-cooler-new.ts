import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { CpuCooler } from '../../models/cpu-cooler'
import { CpuSocket } from '../../models/cpu-socket'
import { Images } from '../../models/images'
import { ItemCode } from '../../models/item-code'
import { Manufacturer } from '../../models/manufacturer'
import {
  checkMinMax,
  mandatoryItemRequimentsBodyChecker,
  validateArrayOfStrings,
} from '../../utils/custom-function-extension'

const router = express.Router()

router.post(
  '/api/parts/cpucooler',
  requireAuth,
  [
    body('name')
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
    } = req.body

    const isAlreadyExist = await CpuCooler.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    const cpuCooler = CpuCooler.build({
      name,
      coolerModel,
      fanRpm,
      noiceLevel,
      bearing,
      waterCooled,
      fanless,
      measurements,
    })

    if (cpuSocket) {
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
        cpuCooler.manufacturer = manufacturerIsAlreadyExist
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        cpuCooler.manufacturer = newManufacturer
      }
    }

    if (itemCode) {
      for (let code of itemCode) {
        const itemCodeIsAlreadyExist = await ItemCode.findOne({
          code: code,
        })

        if (itemCodeIsAlreadyExist) {
          cpuCooler.itemCode.addToSet(itemCodeIsAlreadyExist)
        } else {
          const newItemCode = ItemCode.build({
            code: code,
          })

          await newItemCode.save()
          cpuCooler.itemCode.addToSet(newItemCode)
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
          cpuCooler.itemImages?.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          cpuCooler.itemImages?.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    await cpuCooler.save()
    res.status(201).send(cpuCooler)
  }
)

export { router as NewCpuCoolerRouter }
