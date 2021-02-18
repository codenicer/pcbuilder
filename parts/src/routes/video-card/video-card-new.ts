import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { VideoCard } from '../../models/video-card'
import { Chipset } from '../../models/chipset'
import { MemoryType } from '../../models/memory-type'
import {
  validateArrayofObjects,
  mandatoryItemRequimentsBodyChecker,
} from '../../utils/custom-function-extension'
import { Interfaces } from '../../models/interface'
import { InterfacesType } from '@cnpcbuilder/common'
import { SliCrossfireType } from '../../models/sli-crossfire-type'
import { PortType } from '../../models/port-type'
import { Manufacturer } from '../../models/manufacturer'
import { ItemCode } from '../../models/item-code'
import { Images } from '../../models/images'

const router = express.Router()

router.post(
  '/api/parts/videocard',
  requireAuth,
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Videocard name must be define'),
    body('ports')
      .optional()
      .isArray()
      .custom(validateArrayofObjects)
      .withMessage(
        'Ports must be array of object with a key of name and count'
      ),
    body('interfaces')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Interfaces must be string'),
    body('sliCrossfireType')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Sli-crossfire type must be string'),
    body('chipset')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Chipset must be string'),
    body('memoryType')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Memory type must be string'),
    body('frameSync')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Framesync must be string'),
    body('cooling')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Cooling must be string'),
    body('externalPower')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('External power must be string'),
    body('memory')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Memory must be numeric'),
    body('coreClock')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Core clock must be string'),
    body('boostClock')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Boost clock must be numeric'),
    body('tdp').optional().isNumeric().withMessage('Tdp must be numberic'),
    body('effectiveMemoryClock')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Effective memory clock must be numeric'),
    body('expansionSlotWidth')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Expansion slot width must be numeric'),
    ...mandatoryItemRequimentsBodyChecker,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      chipset,
      memoryType,
      interfaces,
      sliCrossfireType,
      ports,
      frameSync,
      cooling,
      externalPower,
      memory,
      coreClock,
      boostClock,
      tdp,
      effectiveMemoryClock,
      expansionSlotWidth,
      manufacturer,
      itemCode,
      itemImages,
      measurements,
    } = req.body

    const isAlreadyExist = await VideoCard.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    const videocard = VideoCard.build({
      name,
      frameSync,
      cooling,
      externalPower,
      memory,
      coreClock,
      boostClock,
      tdp,
      effectiveMemoryClock,
      expansionSlotWidth,
      measurements,
    })

    if (interfaces) {
      const interfacesIsAlreadyExist = await Interfaces.findOne({
        name: interfaces,
      })

      if (interfacesIsAlreadyExist) {
        videocard.interfaces = interfacesIsAlreadyExist
      } else {
        const newInterface = Interfaces.build({
          name: interfaces,
          type: InterfacesType.Gpu,
        })

        await newInterface.save()

        videocard.interfaces = newInterface
      }
    }

    if (sliCrossfireType) {
      const sliCrossfireTypeIsAlreadyExist = await SliCrossfireType.findOne({
        name: sliCrossfireType,
      })

      if (sliCrossfireTypeIsAlreadyExist) {
        videocard.sliCrossfireType = sliCrossfireTypeIsAlreadyExist
      } else {
        const newSliCrossfireType = SliCrossfireType.build({
          name: sliCrossfireType,
        })

        await newSliCrossfireType.save()
        videocard.sliCrossfireType = newSliCrossfireType
      }
    }

    if (chipset) {
      const chipsetIsAlreadyExist = await Chipset.findOne({ name: chipset })

      if (chipsetIsAlreadyExist) {
        videocard.chipset = chipsetIsAlreadyExist
      } else {
        const newChipset = Chipset.build({
          name: chipset,
        })

        await newChipset.save()
        videocard.chipset = newChipset
      }
    }

    if (memoryType) {
      const memoryTypeIsAlreadyExist = await MemoryType.findOne({
        name: memoryType,
      })

      if (memoryTypeIsAlreadyExist) {
        videocard.memoryType = memoryTypeIsAlreadyExist
      } else {
        const newMemoryType = MemoryType.build({
          name: memoryType,
        })

        await newMemoryType.save()
        videocard.memoryType = newMemoryType
      }
    }

    if (ports) {
      for (let port of ports) {
        let portIsAlreadyExist = await PortType.findOne({
          value: {
            name: port.name,
            count: port.count,
          },
        })

        if (portIsAlreadyExist) {
          videocard.ports?.addToSet(portIsAlreadyExist)
        } else {
          let newPortType = PortType.build({
            value: {
              name: port.name,
              count: port.count,
            },
          })

          await newPortType.save()

          videocard.ports?.addToSet(newPortType)
        }
      }
    }

    if (manufacturer) {
      const manufacturerIsAlreadyExist = await Manufacturer.findOne({
        name: manufacturer.name,
      })

      if (manufacturerIsAlreadyExist) {
        videocard.manufacturer = manufacturerIsAlreadyExist
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        videocard.manufacturer = newManufacturer
      }
    }

    if (itemCode) {
      for (let code of itemCode) {
        const itemCodeIsAlreadyExist = await ItemCode.findOne({
          code: code,
        })

        if (itemCodeIsAlreadyExist) {
          videocard.itemCode.addToSet(itemCodeIsAlreadyExist)
        } else {
          const newItemCode = ItemCode.build({
            code: code,
          })

          await newItemCode.save()
          videocard.itemCode.addToSet(newItemCode)
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
          videocard.itemImages?.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          videocard.itemImages?.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    await videocard.save()
    res.status(201).send(videocard)
  }
)

export { router as NewVideoCardRouter }
