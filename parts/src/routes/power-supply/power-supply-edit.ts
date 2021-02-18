import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { FormFactor } from '../../models/form-factor'
import { Images } from '../../models/images'
import { ItemCode } from '../../models/item-code'
import { Manufacturer } from '../../models/manufacturer'
import { PowerSupply } from '../../models/power-supply'
import { PowerSupplyConnector } from '../../models/power-supply-connector'
import {
  mandatoryItemRequimentsBodyChecker,
  validateArrayofObjects,
} from '../../utils/custom-function-extension'

const router = express.Router()

router.patch(
  '/api/parts/powersupply/:id',
  requireAuth,
  [
    body('name')
      .optional()
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
    body('publish')
      .optional()
      .notEmpty()
      .isBoolean()
      .withMessage('Publish must be boolean'),
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
      publish,
    } = req.body

    const { id } = req.params

    const powerSupply = await PowerSupply.findById(id)

    if (!powerSupply) {
      throw new NotFoundError()
    }

    const isAlreadyExist = await PowerSupply.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) powerSupply.set({ name })
    if (efficiencyRating) powerSupply.set({ efficiencyRating })
    if (modular) powerSupply.set({ modular })
    if (type) powerSupply.set({ type })
    if (wattage) powerSupply.set({ wattage })
    if (measurements) powerSupply.set({ measurements })
    if (typeof fanless === 'boolean') powerSupply.set({ fanless })
    if (typeof publish === 'boolean') powerSupply.set({ publish })

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
      powerSupply.set({ psuConnectors: [] })

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

    if (manufacturer) {
      const manufacturerIsAlreadyExist = await Manufacturer.findOne({
        name: manufacturer.name,
      })

      if (manufacturerIsAlreadyExist) {
        powerSupply.manufacturer = manufacturerIsAlreadyExist
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        powerSupply.manufacturer = newManufacturer
      }
    }

    if (itemCode) {
      powerSupply.set({ itemCode: [] })

      for (let code of itemCode) {
        const itemCodeIsAlreadyExist = await ItemCode.findOne({
          code: code,
        })

        if (itemCodeIsAlreadyExist) {
          powerSupply.itemCode.addToSet(itemCodeIsAlreadyExist)
        } else {
          const newItemCode = ItemCode.build({
            code: code,
          })

          await newItemCode.save()
          powerSupply.itemCode.addToSet(newItemCode)
        }
      }
    }

    if (itemImages) {
      powerSupply.set({ itemImages: [] })

      for (let itemImage of itemImages) {
        let itemImageIsAlreadyExist = await Images.findOne({
          name: itemImage.name,
          url: itemImage.url,
        })

        if (itemImageIsAlreadyExist) {
          powerSupply.itemImages?.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          powerSupply.itemImages?.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    await powerSupply.save()
    await powerSupply
      .populate('formFactor')
      .populate('psuConnectors')
      .populate('manufacturer')
      .populate('itemCode')
      .populate('itemImages')

    res.status(200).send(powerSupply)
  }
)

export { router as EditPowerSupplyRouter }
