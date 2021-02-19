import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  InterfacesType,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Chipset } from '../../models/chipset'
import { MemoryType } from '../../models/memory-type'
import {
  mandatoryItemRequimentsBodyChecker,
  validateArrayofObjects,
} from '../../utils/custom-function-extension'
import mongoose from 'mongoose'
import { VideoCard } from '../../models/video-card'
import { Interfaces } from '../../models/interface'
import { SliCrossfireType } from '../../models/sli-crossfire-type'
import { PortType } from '../../models/port-type'
import { Manufacturer } from '../../models/manufacturer'
import { ItemCode } from '../../models/item-code'
import { Images } from '../../models/images'
import { Items } from '../../models/items'

const router = express.Router()

router.patch(
  '/api/parts/videocard/:id',
  requireAuth,
  [
    body('name')
      .isString()
      .optional()
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
      .isString()
      .withMessage('Sli-crossfire type must be string'),
    body('chipset').optional().isString().withMessage('Chipset must be string'),
    body('memoryType')
      .optional()
      .isString()
      .withMessage('Memory type must be string'),
    body('frameSync')
      .optional()
      .isString()
      .withMessage('Framesync must be string'),
    body('cooling').optional().isString().withMessage('Cooling must be string'),
    body('externalPower')
      .optional()
      .isString()
      .withMessage('External power must be string'),
    body('memory').optional().isNumeric().withMessage('Memory must be numeric'),
    body('coreClock')
      .optional()
      .isNumeric()
      .withMessage('Core clock must be string'),
    body('boostClock')
      .optional()
      .isNumeric()
      .withMessage('Boost clock must be numeric'),
    body('tdp').optional().isNumeric().withMessage('Tdp must be numberic'),
    body('effectiveMemoryClock')
      .optional()
      .isNumeric()
      .withMessage('Effective memory clock must be numeric'),
    body('expansionSlotWidth')
      .optional()
      .isNumeric()
      .withMessage('Expansion slot width must be numeric'),
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
      publish,
      manufacturer,
      itemCode,
      itemImages,
      measurements,
    } = req.body

    const { id } = req.params

    const videoCardDoesExist = await VideoCard.findById(id)

    if (!videoCardDoesExist) {
      throw new NotFoundError()
    }

    const itemInfo = await Items.findById({ _id: videoCardDoesExist?.itemInfo })

    if (!itemInfo) {
      throw new NotFoundError()
    }

    const isAlreadyExist = await Items.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) itemInfo.set({ name })
    if (frameSync) videoCardDoesExist.set({ frameSync })
    if (cooling) videoCardDoesExist.set({ cooling })
    if (externalPower) videoCardDoesExist.set({ externalPower })
    if (memory) videoCardDoesExist.set({ memory })
    if (coreClock) videoCardDoesExist.set({ coreClock })
    if (boostClock) videoCardDoesExist.set({ boostClock })
    if (tdp) videoCardDoesExist.set({ tdp })
    if (effectiveMemoryClock) videoCardDoesExist.set({ effectiveMemoryClock })
    if (expansionSlotWidth) videoCardDoesExist.set({ expansionSlotWidth })
    if (typeof publish === 'boolean') itemInfo.set({ publish })
    if (measurements) itemInfo.set({ measurements })

    if (interfaces) {
      const interfacesIsAlreadyExist = await Interfaces.findOne({
        name: interfaces,
      })

      if (interfacesIsAlreadyExist) {
        videoCardDoesExist.interfaces = interfacesIsAlreadyExist
      } else {
        const newInterface = Interfaces.build({
          name: interfaces,
          type: InterfacesType.Gpu,
        })

        await newInterface.save()

        videoCardDoesExist.interfaces = newInterface
      }
    }

    if (sliCrossfireType) {
      const sliCrossfireTypeIsAlreadyExist = await SliCrossfireType.findOne({
        name: sliCrossfireType,
      })

      if (sliCrossfireTypeIsAlreadyExist) {
        videoCardDoesExist.sliCrossfireType = sliCrossfireTypeIsAlreadyExist
      } else {
        const newSliCrossfireType = SliCrossfireType.build({
          name: sliCrossfireType,
        })

        await newSliCrossfireType.save()
        videoCardDoesExist.sliCrossfireType = newSliCrossfireType
      }
    }

    if (chipset) {
      const chipsetIsAlreadyExist = await Chipset.findOne({ name: chipset })

      if (chipsetIsAlreadyExist) {
        videoCardDoesExist.chipset = chipsetIsAlreadyExist
      } else {
        const newChipset = Chipset.build({
          name: chipset,
        })

        await newChipset.save()
        videoCardDoesExist.chipset = newChipset
      }
    }

    if (memoryType) {
      const memoryTypeIsAlreadyExist = await MemoryType.findOne({
        name: memoryType,
      })

      if (memoryTypeIsAlreadyExist) {
        videoCardDoesExist.memoryType = memoryTypeIsAlreadyExist
      } else {
        const newMemoryType = MemoryType.build({
          name: memoryType,
        })

        await newMemoryType.save()
        videoCardDoesExist.memoryType = newMemoryType
      }
    }

    if (ports) {
      videoCardDoesExist.set({ ports: [] })
      for (let port of ports) {
        let portIsAlreadyExist = await PortType.findOne({
          value: {
            name: port.name,
            count: port.count,
          },
        })

        if (portIsAlreadyExist) {
          videoCardDoesExist.ports?.addToSet(portIsAlreadyExist)
        } else {
          let newPortType = PortType.build({
            value: {
              name: port.name,
              count: port.count,
            },
          })

          await newPortType.save()

          videoCardDoesExist.ports?.addToSet(newPortType)
        }
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
    await videoCardDoesExist.save()
    await videoCardDoesExist
      .populate('chipset')
      .populate('memoryType')
      .populate('interfaces')
      .populate('sliCrossfireType')
      .populate('ports')
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

    res.status(200).send(videoCardDoesExist)
  }
)

export { router as EditVideoCardRouter }
