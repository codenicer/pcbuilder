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
import { Manufacturer } from '../../models/manufacturer'
import { mandatoryItemRequimentsBodyChecker } from '../../utils/custom-function-extension'
import { OpticalDrive } from '../../models/optical-drive'
import { Items } from '../../models/items'

const router = express.Router()

router.post(
  '/api/parts/opticaldrive',
  requireAuth,
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Optical drive name must be define'),
    body('formFactor')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Form factor must be string'),
    body('interfaces')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Interface must be string'),
    body('bufferCache')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('Buffer cache must be numeric'),
    body('bdRomSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('BD rom speed must be numeric'),
    body('dvdRomSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('DVD rom speed must be numeric'),
    body('cdRomSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('CD rom speed must be numeric'),
    body('dvdPositiveRDualLayerSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('DVD+R dual layer speed must be numeric'),
    body('dvdPositiveRSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('DVD+R speed must be numeric'),
    body('dvdPositiveRWSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('DVD+RW speed must be numeric'),
    body('dvdNegativeRDualLayerSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('DVD-R dual layer speed must be numeric'),
    body('dvdNegativeRSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('DVD-R speed must be numeric'),
    body('dvdNegativeRAMSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('DVD-RAM speed must be numeric'),
    body('dvdNegativeRWSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('DVD-RW speed must be numeric'),
    body('cdNegativeRSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('CD-R speed must be numeric'),
    body('cdNegativeRWSpeed')
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage('CD-RW speed must be numeric'),
    ...mandatoryItemRequimentsBodyChecker,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      interfaces,
      formFactor,
      bufferCache,
      bdRomSpeed,
      dvdRomSpeed,
      cdRomSpeed,
      dvdPositiveRDualLayerSpeed,
      dvdPositiveRSpeed,
      dvdPositiveRWSpeed,
      dvdNegativeRDualLayerSpeed,
      dvdNegativeRSpeed,
      dvdNegativeRAMSpeed,
      dvdNegativeRWSpeed,
      cdNegativeRSpeed,
      cdNegativeRWSpeed,
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

    const opticalDrive = OpticalDrive.build({
      itemInfo: newItems,
      bufferCache,
      bdRomSpeed,
      dvdRomSpeed,
      cdRomSpeed,
      dvdPositiveRDualLayerSpeed,
      dvdPositiveRSpeed,
      dvdPositiveRWSpeed,
      dvdNegativeRDualLayerSpeed,
      dvdNegativeRSpeed,
      dvdNegativeRAMSpeed,
      dvdNegativeRWSpeed,
      cdNegativeRSpeed,
      cdNegativeRWSpeed,
    })

    if (formFactor) {
      const fromFactorIsAlreadyExist = await FormFactor.findOne({
        name: formFactor,
      })

      if (fromFactorIsAlreadyExist) {
        opticalDrive.formFactor = fromFactorIsAlreadyExist
      } else {
        const newFormFactor = FormFactor.build({
          name: formFactor,
        })

        await newFormFactor.save()

        opticalDrive.formFactor = newFormFactor
      }
    }

    if (interfaces) {
      const interfacesIsAlreadyExist = await Interfaces.findOne({
        name: interfaces,
      })

      if (interfacesIsAlreadyExist) {
        opticalDrive.interfaces = interfacesIsAlreadyExist
      } else {
        const newInterfaces = Interfaces.build({
          name: interfaces,
          type: InterfacesType.OpticalDrive,
        })

        await newInterfaces.save()

        opticalDrive.formFactor = newInterfaces
      }
    }

    await opticalDrive.save()

    res.status(201).send(opticalDrive)
  }
)

export { router as NewOpticalDriveRouter }
