import {
  requireAuth,
  validateRequest,
  BadRequestError,
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
import { Manufacturer } from '../../models/manufacturer'
import { ItemCode } from '../../models/item-code'
import { Images } from '../../models/images'
import { Items } from '../../models/items'

const router = express.Router()

router.post(
  '/api/parts/motherboard',
  requireAuth,
  [
    body('name')
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
      .isString()
      .withMessage('Form factor must be string'),
    body('chipset')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('Chipset must be string'),
    body('memoryType')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Memory type must be string'),
    body('wirelessNetworking')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Wireless networking must be string'),
    body('onBoardVideo')
      .optional()
      .isString()
      .notEmpty()
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
      .withMessage('RAM slot must be numeric'),
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

    const motherboard = MotherBoard.build({
      itemInfo: newItems,
      wirelessNetworking,
      onBoardVideo,
      sliCrossFire,
      ramSlot,
      onboardEthernet,
      supportEcc,
      raidSupport,
    })

    if (cpuSocket) {
      const cpuSocketIsAlreadyExist = await CpuSocket.findOne({
        name: cpuSocket,
      })

      if (cpuSocketIsAlreadyExist) {
        motherboard.cpuSocket = cpuSocketIsAlreadyExist
      } else {
        const newCpuSocket = CpuSocket.build({
          name: cpuSocket,
        })
        await newCpuSocket.save()

        motherboard.cpuSocket = newCpuSocket
      }
    }

    if (formFactor) {
      const formFactorIsAlreadyExist = await FormFactor.findOne({
        name: formFactor,
      })

      if (formFactorIsAlreadyExist) {
        motherboard.formFactor = formFactorIsAlreadyExist
      } else {
        const newformFactor = FormFactor.build({
          name: formFactor,
        })

        await newformFactor.save()

        motherboard.formFactor = newformFactor
      }
    }

    if (chipset) {
      const chipsetIsAlreadyExist = await Chipset.findOne({ name: chipset })

      if (chipsetIsAlreadyExist) {
        motherboard.chipset = chipsetIsAlreadyExist
      } else {
        const newChipset = Chipset.build({
          name: chipset,
        })

        await newChipset.save()
        motherboard.chipset = newChipset
      }
    }

    if (memoryType) {
      const memoryTypeIsAlreadyExist = await MemoryType.findOne({
        name: memoryType,
      })

      if (memoryTypeIsAlreadyExist) {
        motherboard.memoryType = memoryTypeIsAlreadyExist
      } else {
        const newMemoryType = MemoryType.build({
          name: memoryType,
        })

        await newMemoryType.save()
        motherboard.memoryType = newMemoryType
      }
    }

    if (memorySpeed) {
      for (let mspeed of memorySpeed) {
        let mspeedIsAlreadyExist = await MemorySpeed.findOne({ name: mspeed })

        if (mspeedIsAlreadyExist) {
          motherboard.memorySpeed?.addToSet(mspeedIsAlreadyExist)
        } else {
          let newMemorySpeed = MemorySpeed.build({
            name: mspeed,
          })

          await newMemorySpeed.save()

          motherboard.memorySpeed?.addToSet(newMemorySpeed)
        }
      }
    }

    if (pcieSlots) {
      // c.filter((c,i,s)=>i === s.findIndex((t)=>(t.name === c.name && t.count === c.count)))

      for (let pcieSlot of pcieSlots) {
        let pcieSlotIsAlreadyExist = await PcieSlots.findOne({
          value: {
            name: pcieSlot!.name,
            count: pcieSlot!.count,
          },
        })

        if (pcieSlotIsAlreadyExist) {
          motherboard.pcieSlots?.addToSet(pcieSlotIsAlreadyExist)
          // motherboard.pcieSlots?.push(pcieSlotIsAlreadyExist)
        } else {
          let newPcieSlot = PcieSlots.build({
            value: {
              name: pcieSlot!.name,
              count: pcieSlot!.count,
            },
          })

          await newPcieSlot.save()

          motherboard.pcieSlots?.addToSet(pcieSlotIsAlreadyExist)
        }
      }
    }

    if (usbSlots) {
      for (let usbSlot of usbSlots) {
        let usbSlotIsAlreadyExist = await UsbSlots.findOne({
          value: {
            name: usbSlot.name,
            count: usbSlot.count,
          },
        })

        if (usbSlotIsAlreadyExist) {
          motherboard.usbSlots?.addToSet(usbSlotIsAlreadyExist)
        } else {
          let newUsbSlot = UsbSlots.build({
            value: {
              name: usbSlot.name,
              count: usbSlot.count,
            },
          })

          await newUsbSlot.save()

          motherboard.usbSlots?.addToSet(newUsbSlot)
        }
      }
    }

    if (sataSlots) {
      for (let sataSlot of sataSlots) {
        let sataSlotIsAlreadyExist = await SataSlots.findOne({
          value: {
            name: sataSlot.name,
            count: sataSlot.count,
          },
        })

        if (sataSlotIsAlreadyExist) {
          motherboard.sataSlots?.addToSet(sataSlotIsAlreadyExist)
        } else {
          let newSataSlot = SataSlots.build({
            value: {
              name: sataSlot.name,
              count: sataSlot.count,
            },
          })

          await newSataSlot.save()

          motherboard.sataSlots?.addToSet(newSataSlot)
        }
      }
    }

    await newItems.save()
    await motherboard.save()
    res.status(201).send(motherboard)
  }
)

export { router as NewMotherBoardRouter }
