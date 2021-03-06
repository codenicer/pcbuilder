import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  mandatoryItemRequimentsBodyChecker,
  validateArrayOfStrings,
} from '../../utils/custom-function-extension'
import { Items } from '../../models/items'
import { Manufacturer } from '../../models/manufacturer'
import { ItemCode } from '../../models/item-code'
import { Images } from '../../models/images'
import { Casing } from '../../models/casing'
import { FormFactor } from '../../models/form-factor'

const router = express.Router()

router.post(
  '/api/parts/casing',
  requireAuth,
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Casing name must be define'),
    body('motherboardFromFactor')
      .optional()
      .isArray()
      .custom(validateArrayOfStrings)
      .withMessage('Form factor must be array of string'),
    body('maxVideoCardLength')
      .optional()
      .isArray()
      .custom(validateArrayOfStrings)
      .withMessage('Front pannel usb must be array of string'),
    body('caseFrontPannelUsb')
      .optional()
      .isArray()
      .custom(validateArrayOfStrings)
      .withMessage('Form factor must be array of string'),
    body('volume')
      .optional()
      .isArray()
      .custom(validateArrayOfStrings)
      .withMessage('Volume must be array of string'),
    body('type')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Type must be string'),
    body('sidePanelWindow')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Side pannel window must be string'),
    body('powersupply')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Power supply must be string'),
    body('halfHeightExpansionSlot')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Half height expansion slot must be numeric'),
    body('fullHeightExpansionSlot')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Full height expansion slot must be numeric'),
    body('internal25Bays')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Internal 2.5 bays must be numeric'),
    body('internal35Bays')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Internal 3.5 bays must be numeric'),
    ...mandatoryItemRequimentsBodyChecker,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      motherboardFromFactor,
      caseFrontPannelUsb,
      maxVideoCardLength,
      volume,
      type,
      sidePanelWindow,
      powersupply,
      halfHeightExpansionSlot,
      fullHeightExpansionSlot,
      internal25Bays,
      internal35Bays,
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

    const casing = Casing.build({
      caseFrontPannelUsb,
      maxVideoCardLength,
      volume,
      type,
      sidePanelWindow,
      powersupply,
      halfHeightExpansionSlot,
      fullHeightExpansionSlot,
      internal25Bays,
      internal35Bays,
      itemInfo: newItems,
    })

    if (motherboardFromFactor) {
      for (let formfactor of motherboardFromFactor) {
        let formFactorIsAlreadyExist = await FormFactor.findOne({
          name: formfactor,
        })

        if (formFactorIsAlreadyExist) {
          casing.motherboardFromFactor?.addToSet(formFactorIsAlreadyExist)
        } else {
          let newFormFactor = FormFactor.build({
            name: formfactor,
          })

          await newFormFactor.save()

          casing.motherboardFromFactor?.addToSet(newFormFactor)
        }
      }
    }

    await casing.save()
    res.status(201).send(casing)
  }
)

export { router as NewCasingRouter }
