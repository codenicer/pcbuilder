import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  mandatoryItemRequimentsBodyChecker,
  validateArrayOfStrings,
} from '../../utils/custom-function-extension'
import { Manufacturer } from '../../models/manufacturer'
import { ItemCode } from '../../models/item-code'
import { Images } from '../../models/images'
import { Casing } from '../../models/casing'
import { FormFactor } from '../../models/form-factor'
import { Items } from '../../models/items'

const router = express.Router()

router.patch(
  '/api/parts/casing/:id',
  requireAuth,
  [
    body('name')
      .optional()
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
    body('publish')
      .optional()
      .notEmpty()
      .isBoolean()
      .withMessage('Publish must be boolean'),
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
      publish,
    } = req.body

    const { id } = req.params

    const casing = await Casing.findById(id)

    if (!casing) {
      throw new NotFoundError()
    }

    const itemInfo = await Items.findById({ _id: casing?.itemInfo })

    if (!itemInfo) {
      throw new NotFoundError()
    }

    const isAlreadyExist = await Items.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) itemInfo.set({ name })
    if (caseFrontPannelUsb) casing.set({ caseFrontPannelUsb })
    if (maxVideoCardLength) casing.set({ maxVideoCardLength })
    if (volume) casing.set({ volume })
    if (type) casing.set({ type })
    if (sidePanelWindow) casing.set({ sidePanelWindow })
    if (powersupply) casing.set({ powersupply })
    if (halfHeightExpansionSlot) casing.set({ halfHeightExpansionSlot })
    if (fullHeightExpansionSlot) casing.set({ fullHeightExpansionSlot })
    if (internal25Bays) casing.set({ internal25Bays })
    if (internal35Bays) casing.set({ internal35Bays })
    if (measurements) itemInfo.set({ measurements })
    if (typeof publish === 'boolean') itemInfo.set({ publish })

    if (motherboardFromFactor) {
      casing.set({ motherboardFromFactor: [] })

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

    if (manufacturer) {
      const manufacturerIsAlreadyExist = await Manufacturer.findOne({
        name: manufacturer.name,
      })

      if (manufacturerIsAlreadyExist) {
        itemInfo.set({
          manufacturer: manufacturerIsAlreadyExist,
        })
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        itemInfo.set({
          manufacturer: newManufacturer,
        })
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
          itemInfo.itemImages.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          itemInfo.itemImages.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    await itemInfo.save()
    await casing.save()
    await casing
      .populate('motherboardFromFactor')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')
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

    res.status(200).send(casing)
  }
)

export { router as EditCasingRouter }
