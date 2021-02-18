import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  InterfacesType,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { FormFactor } from '../../models/form-factor'
import { Images } from '../../models/images'
import { Interfaces } from '../../models/interface'
import { ItemCode } from '../../models/item-code'
import { Manufacturer } from '../../models/manufacturer'
import { Storage } from '../../models/storage'
import { mandatoryItemRequimentsBodyChecker } from '../../utils/custom-function-extension'

const router = express.Router()

router.patch(
  '/api/parts/storage/:id',
  requireAuth,
  [
    body('name')
      .optional()
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
      publish,
    } = req.body

    const { id } = req.params

    const storageDoesExist = await Storage.findById(id)

    if (!storageDoesExist) {
      throw new NotFoundError()
    }

    const isAlreadyExist = await Storage.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) storageDoesExist.set({ name })
    if (type) storageDoesExist.set({ type })
    if (capacity) storageDoesExist.set({ capacity })
    if (pricePerGb) storageDoesExist.set({ pricePerGb })
    if (typeof isNvme === 'boolean') storageDoesExist.set({ isNvme })
    if (measurements) storageDoesExist.set({ measurements })
    if (typeof publish === 'boolean') storageDoesExist.set({ publish })

    if (interfaces) {
      const interfacesIsAlreadyExist = await Interfaces.findOne({
        name: interfaces,
      })

      if (interfacesIsAlreadyExist) {
        storageDoesExist.interfaces = interfacesIsAlreadyExist
      } else {
        const newInterface = Interfaces.build({
          name: interfaces,
          type: InterfacesType.Storage,
        })

        await newInterface.save()

        storageDoesExist.interfaces = newInterface
      }
    }

    if (formFactor) {
      const formFactorIsAlreadyExist = await FormFactor.findOne({
        name: formFactor,
      })

      if (formFactorIsAlreadyExist) {
        storageDoesExist.formFactor = formFactorIsAlreadyExist
      } else {
        const newFormFactor = FormFactor.build({
          name: formFactor,
        })

        await newFormFactor.save()

        storageDoesExist.formFactor = newFormFactor
      }
    }

    if (manufacturer) {
      const manufacturerIsAlreadyExist = await Manufacturer.findOne({
        name: manufacturer.name,
      })

      if (manufacturerIsAlreadyExist) {
        storageDoesExist.manufacturer = manufacturerIsAlreadyExist
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        storageDoesExist.manufacturer = newManufacturer
      }
    }

    if (itemCode) {
      storageDoesExist.set({ itemCode: [] })
      for (let code of itemCode) {
        const itemCodeIsAlreadyExist = await ItemCode.findOne({
          code: code,
        })

        if (itemCodeIsAlreadyExist) {
          storageDoesExist.itemCode.addToSet(itemCodeIsAlreadyExist)
        } else {
          const newItemCode = ItemCode.build({
            code: code,
          })

          await newItemCode.save()
          storageDoesExist.itemCode.addToSet(newItemCode)
        }
      }
    }

    if (itemImages) {
      storageDoesExist.set({ itemImages: [] })
      for (let itemImage of itemImages) {
        let itemImageIsAlreadyExist = await Images.findOne({
          name: itemImage.name,
          url: itemImage.url,
        })

        if (itemImageIsAlreadyExist) {
          storageDoesExist.itemImages?.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          storageDoesExist.itemImages?.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    await storageDoesExist.save()
    await storageDoesExist
      .populate('formFactor')
      .populate('interfaces')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')

    res.status(200).send(storageDoesExist)
  }
)

export { router as EditStorageRouter }
