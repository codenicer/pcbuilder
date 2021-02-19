import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { FormFactor } from '../../models/form-factor'
import { Images } from '../../models/images'
import { ItemCode } from '../../models/item-code'
import { Items } from '../../models/items'
import { Manufacturer } from '../../models/manufacturer'
import { PowerSupply } from '../../models/power-supply'
import { PowerSupplyConnector } from '../../models/power-supply-connector'
import {
  mandatoryItemRequimentsBodyChecker,
  validateArrayofObjects,
} from '../../utils/custom-function-extension'

const router = express.Router()

router.post(
  '/api/parts/powersupply',
  requireAuth,
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Powersupply name must be define'),

    body('psuConnectors')
      .optional()
      .isArray()
      .custom(validateArrayofObjects)
      .withMessage(
        'PSU connectors must be array of objects with a name and count key'
      ),
    body('formFactor')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Form factor must be string'),
    body('efficiencyRating')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Efficiency Rating must be string'),
    body('modular')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Modular must be string'),
    body('type')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Type must be string'),
    body('wattage')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('Wattage must be numeric'),
    body('fanless')
      .optional()
      .isBoolean()
      .notEmpty()
      .withMessage('Fanless must be boolean'),
    ...mandatoryItemRequimentsBodyChecker,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      formFactor,
      psuConnectors,
      efficiencyRating,
      modular,
      type,
      wattage,
      fanless,
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

    const powerSupply = PowerSupply.build({
      itemInfo: newItems,
      efficiencyRating,
      modular,
      type,
      wattage,
      fanless,
    })

    if (formFactor) {
      const formFactorIsAlreadyExist = await FormFactor.findOne({
        name: formFactor,
      })

      if (formFactorIsAlreadyExist) {
        powerSupply.formFactor = formFactorIsAlreadyExist
      } else {
        const newFormFactor = FormFactor.build({
          name: formFactor,
        })

        await newFormFactor.save()

        powerSupply.formFactor = newFormFactor
      }
    }

    if (psuConnectors) {
      for (let connector of psuConnectors as [
        { name: string; count: number }
      ]) {
        let connectorIsAlreadyExist = await PowerSupplyConnector.findOne({
          value: {
            name: connector.name,
            count: connector.count,
          },
        })

        if (connectorIsAlreadyExist) {
          powerSupply.psuConnectors?.addToSet(connectorIsAlreadyExist)
        } else {
          let newPsuConnector = PowerSupplyConnector.build({
            value: {
              name: connector.name,
              count: connector.count,
            },
          })

          await newPsuConnector.save()

          powerSupply.psuConnectors?.addToSet(newPsuConnector)
        }
      }
    }

    await powerSupply.save()
    res.status(201).send(powerSupply)
  }
)

export { router as NewPowerSupplyRouter }
