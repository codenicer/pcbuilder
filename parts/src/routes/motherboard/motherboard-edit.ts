import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { MotherBoard } from '../../models/motherboard'
import { CpuSocket } from '../../models/cpu-socket'
import { FormFactor } from '../../models/form-factor'
import { Chipset } from '../../models/chipset'
import { MemoryType } from '../../models/memory-type'
import { MemorySpeed } from '../../models/memory-speed'
import { PcieSlots } from '../../models/pcie-slot'
import { UsbSlots } from '../../models/usb-slots'
import { SataSlots } from '../../models/sata-slot'
import {
  mandatoryItemRequimentsBodyChecker,
  validateArrayofObjects,
  validateArrayOfStrings,
} from '../../utils/custom-function-extension'
import mongoose from 'mongoose'
import { Manufacturer } from '../../models/manufacturer'
import { ItemCode } from '../../models/item-code'
import { Images } from '../../models/images'
import { Items } from '../../models/items'

const router = express.Router()

router.patch(
  '/api/parts/motherboard/:id',
  requireAuth,
  [
    body('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Motherboard name must be define'),
    body('memorySpeed')
      .optional()

      .isArray()
      .custom(validateArrayOfStrings)
      .withMessage('Memory speed must be array of string'),
    body('pcieSlots')
      .optional()
      .isArray()
      .custom(validateArrayofObjects)
      .withMessage(
        'Pcie slot must be array of object with a key of name and count'
      ),
    body('usbSlots')
      .optional()
      .isArray()
      .custom(validateArrayofObjects)
      .withMessage(
        'Usb slot must be array of object with a key of name and count'
      ),
    body('sataSlots')
      .optional()
      .isArray()
      .custom(validateArrayofObjects)
      .withMessage(
        'Sata slot must be array of object with a key of name and count'
      ),
    body('cpuSocket')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Cpu socket must be string'),
    body('formFactor')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Form factor must be string'),
    body('chipset')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Chipset must be string'),
    body('memoryType')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Memory type must be string'),
    body('wirelessNetworking')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Wireless networking must be string'),
    body('onBoardVideo')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Onboard video must be string'),
    body('sliCrossFire')
      .optional()
      .notEmpty()
      .isBoolean()
      .withMessage('SLI crossfire must be boolean'),
    body('ramSlot')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('RAM slot must be numbers'),
    body('onboardEthernet')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Onboard ethernet must be string'),
    body('supportEcc')
      .optional()
      .notEmpty()
      .isBoolean()
      .withMessage('Ecc support must be boolean'),
    body('raidSupport')
      .optional()
      .notEmpty()
      .isBoolean()
      .withMessage('Raid support must be boolean'),
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
      cpuSocket, //s
      formFactor, //s
      chipset, //s
      memoryType, //s
      memorySpeed, //m
      pcieSlots, //m
      usbSlots, //m
      sataSlots, //m
      wirelessNetworking,
      onBoardVideo,
      sliCrossFire,
      ramSlot,
      onboardEthernet,
      supportEcc,
      raidSupport,
      publish,
      manufacturer,
      itemCode,
      itemImages,
      measurements,
    } = req.body

    const { id } = req.params

    const motherboardDoesExist = await MotherBoard.findById(id)

    if (!motherboardDoesExist) {
      throw new NotFoundError()
    }

    const itemInfo = await Items.findById({
      _id: motherboardDoesExist?.itemInfo,
    })

    if (!itemInfo) {
      throw new NotFoundError()
    }

    const isAlreadyExist = await Items.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) itemInfo.set({ name })
    if (wirelessNetworking) motherboardDoesExist.set({ wirelessNetworking })
    if (onBoardVideo) motherboardDoesExist.set({ onBoardVideo })
    if (sliCrossFire) motherboardDoesExist.set({ sliCrossFire })
    if (ramSlot) motherboardDoesExist.set({ ramSlot })
    if (onboardEthernet) motherboardDoesExist.set({ onboardEthernet })
    if (typeof supportEcc === 'boolean')
      motherboardDoesExist.set({ supportEcc })
    if (typeof raidSupport === 'boolean')
      motherboardDoesExist.set({ raidSupport })
    if (typeof publish === 'boolean') itemInfo.set({ publish })
    if (measurements) itemInfo.set({ measurements })

    if (cpuSocket) {
      const cpuSocketIsAlreadyExist = await CpuSocket.findOne({
        name: cpuSocket,
      })

      if (cpuSocketIsAlreadyExist) {
        motherboardDoesExist.cpuSocket = cpuSocketIsAlreadyExist
      } else {
        const newCpuSocket = CpuSocket.build({
          name: cpuSocket,
        })

        await newCpuSocket.save()

        motherboardDoesExist.cpuSocket = newCpuSocket
      }
    }

    if (formFactor) {
      const formFactorIsAlreadyExist = await FormFactor.findOne({
        name: formFactor,
      })

      if (formFactorIsAlreadyExist) {
        motherboardDoesExist.formFactor = formFactorIsAlreadyExist
      } else {
        const newformFactor = FormFactor.build({
          name: formFactor,
        })

        await newformFactor.save()

        motherboardDoesExist.formFactor = newformFactor
      }
    }

    if (chipset) {
      const chipsetIsAlreadyExist = await Chipset.findOne({ name: chipset })

      if (chipsetIsAlreadyExist) {
        motherboardDoesExist.chipset = chipsetIsAlreadyExist
      } else {
        const newChipset = Chipset.build({
          name: chipset,
        })

        await newChipset.save()
        motherboardDoesExist.chipset = newChipset
      }
    }

    if (memoryType) {
      const memoryTypeIsAlreadyExist = await MemoryType.findOne({
        name: memoryType,
      })

      if (memoryTypeIsAlreadyExist) {
        motherboardDoesExist.memoryType = memoryTypeIsAlreadyExist
      } else {
        const newMemoryType = MemoryType.build({
          name: memoryType,
        })

        await newMemoryType.save()
        motherboardDoesExist.memoryType = newMemoryType
      }
    }

    if (memorySpeed) {
      motherboardDoesExist.set({ memorySpeed: [] })
      for (let mspeed of memorySpeed) {
        let mspeedIsAlreadyExist = await MemorySpeed.findOne({ name: mspeed })

        if (mspeedIsAlreadyExist) {
          motherboardDoesExist.memorySpeed?.addToSet(mspeedIsAlreadyExist)
        } else {
          let newMemorySpeed = MemorySpeed.build({
            name: mspeed,
          })

          await newMemorySpeed.save()

          motherboardDoesExist.memorySpeed?.addToSet(newMemorySpeed)
        }
      }
    }

    if (pcieSlots) {
      // c.filter((c,i,s)=>i === s.findIndex((t)=>(t.name === c.name && t.count === c.count)))
      motherboardDoesExist.set({ pcieSlots: [] })
      for (let pcieSlot of pcieSlots) {
        let pcieSlotIsAlreadyExist = await PcieSlots.findOne({
          value: {
            name: pcieSlot!.name,
            count: pcieSlot!.count,
          },
        })

        if (pcieSlotIsAlreadyExist) {
          motherboardDoesExist.pcieSlots?.addToSet(pcieSlotIsAlreadyExist)
          // motherboard.pcieSlots?.push(pcieSlotIsAlreadyExist)
        } else {
          let newPcieSlot = PcieSlots.build({
            value: {
              name: pcieSlot!.name,
              count: pcieSlot!.count,
            },
          })

          await newPcieSlot.save()

          motherboardDoesExist.pcieSlots?.addToSet(pcieSlotIsAlreadyExist)
        }
      }
    }

    if (usbSlots) {
      motherboardDoesExist.set({ usbSlots: [] })
      for (let usbSlot of usbSlots) {
        let usbSlotIsAlreadyExist = await UsbSlots.findOne({
          value: {
            name: usbSlot.name,
            count: usbSlot.count,
          },
        })

        if (usbSlotIsAlreadyExist) {
          motherboardDoesExist.usbSlots?.addToSet(usbSlotIsAlreadyExist)
        } else {
          let newUsbSlot = UsbSlots.build({
            value: {
              name: usbSlot.name,
              count: usbSlot.count,
            },
          })

          await newUsbSlot.save()

          motherboardDoesExist.usbSlots?.addToSet(newUsbSlot)
        }
      }
    }

    if (sataSlots) {
      motherboardDoesExist.set({ sataSlots: [] })
      for (let sataSlot of sataSlots) {
        let sataSlotIsAlreadyExist = await SataSlots.findOne({
          value: {
            name: sataSlot.name,
            count: sataSlot.count,
          },
        })

        if (sataSlotIsAlreadyExist) {
          motherboardDoesExist.sataSlots?.addToSet(sataSlotIsAlreadyExist)
        } else {
          let newSataSlot = SataSlots.build({
            value: {
              name: sataSlot.name,
              count: sataSlot.count,
            },
          })

          await newSataSlot.save()

          motherboardDoesExist.sataSlots?.addToSet(newSataSlot)
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

    await motherboardDoesExist.save()
    await motherboardDoesExist
      .populate('cpuSocket')
      .populate('formFactor')
      .populate('chipset')
      .populate('memoryType')
      .populate('memorySpeed')
      .populate('pcieSlots')
      .populate('usbSlots')
      .populate('sataSlots')
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

    res.status(200).send(motherboardDoesExist)
  }
)

export { router as EditMotherboardRouter }
