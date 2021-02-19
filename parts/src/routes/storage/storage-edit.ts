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
import { Items } from '../../models/items'
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

    const itemInfo = await Items.findById({ _id: storageDoesExist?.itemInfo })

    if (!itemInfo) {
      throw new NotFoundError()
    }

    const isAlreadyExist = await Storage.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) itemInfo.set({ name })
    if (type) storageDoesExist.set({ type })
    if (capacity) storageDoesExist.set({ capacity })
    if (pricePerGb) storageDoesExist.set({ pricePerGb })
    if (typeof isNvme === 'boolean') storageDoesExist.set({ isNvme })
    if (measurements) itemInfo.set({ measurements })
    if (typeof publish === 'boolean') itemInfo.set({ publish })

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
    await storageDoesExist.save()
    await storageDoesExist
      .populate('formFactor')
      .populate('interfaces')
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

    res.status(200).send(storageDoesExist)
  }
)

export { router as EditStorageRouter }
