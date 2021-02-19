import {
  requireAuth,
  validateRequest,
  BadRequestError,
  InterfacesType,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { FormFactor } from '../../models/form-factor'
import { Images } from '../../models/images'
import { Interfaces } from '../../models/interface'
import { ItemCode } from '../../models/item-code'
import { Items } from '../../models/items'
import { Manufacturer } from '../../models/manufacturer'
import { Storage } from '../../models/storage'
import { mandatoryItemRequimentsBodyChecker } from '../../utils/custom-function-extension'

const router = express.Router()

router.post(
  '/api/parts/storage',
  requireAuth,
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Storage name must be define'),
    body('formFactor')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Form factor must be string'),
    body('interfaces')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Interfaces must be string'),
    body('type')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Type must be string'),
    body('capacity')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Capacity must be numeric'),
    body('pricePerGb')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Price per GB must be numeric'),
    body('isNvme')
      .optional()
      .notEmpty()
      .isBoolean()
      .withMessage('Is nvme must be boolean'),
    ...mandatoryItemRequimentsBodyChecker,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      formFactor,
      interfaces,
      type,
      capacity,
      pricePerGb,
      isNvme,
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

    await newItems.save()

    const storage = Storage.build({
      itemInfo: newItems,
      type,
      capacity,
      pricePerGb,
      isNvme,
    })

    if (interfaces) {
      const interfacesIsAlreadyExist = await Interfaces.findOne({
        name: interfaces,
      })

      if (interfacesIsAlreadyExist) {
        storage.interfaces = interfacesIsAlreadyExist
      } else {
        const newInterface = Interfaces.build({
          name: interfaces,
          type: InterfacesType.Storage,
        })

        await newInterface.save()

        storage.interfaces = newInterface
      }
    }

    if (formFactor) {
      const formFactorIsAlreadyExist = await FormFactor.findOne({
        name: formFactor,
      })

      if (formFactorIsAlreadyExist) {
        storage.formFactor = formFactorIsAlreadyExist
      } else {
        const newFormFactor = FormFactor.build({
          name: formFactor,
        })

        await newFormFactor.save()

        storage.formFactor = newFormFactor
      }
    }

    await storage.save()

    res.status(201).send(storage)
  }
)

export { router as NewStorageRouter }
