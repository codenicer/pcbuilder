import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { ChipsetDoc } from './chipset'
import { CpuSocketDoc } from './cpu-socket'
import { FormFactorDoc } from './form-factor'
import { ItemAttrs, ItemDoc } from './item'
import { MemorySpeedDoc } from './memory-speed'
import { MemoryTypeDoc } from './memory-type'
import { PcieSlotsDoc } from './pcie-slot'
import { SataSlotsDoc } from './sata-slot'
import { UsbSlotsDoc } from './usb-slots'

interface MotherboardAttrs extends ItemAttrs {
  name: string
  cpuSocket?: CpuSocketDoc
  formFactor?: FormFactorDoc
  chipset?: ChipsetDoc
  memoryType?: MemoryTypeDoc
  memorySpeed?: MemorySpeedDoc[]
  pcieSlots?: PcieSlotsDoc[]
  usbSlots?: UsbSlotsDoc[]
  sataSlots?: SataSlotsDoc[]
  wirelessNetworking?: string
  onBoardVideo?: string
  sliCrossFire?: boolean
  ramSlot?: number
  onboardEthernet?: string
  supportEcc?: boolean
  raidSupport?: boolean
}

interface MotherboardDoc extends ItemDoc {
  name: string
  cpuSocket?: CpuSocketDoc
  formFactor?: FormFactorDoc
  chipset?: ChipsetDoc
  memoryType?: MemoryTypeDoc
  memorySpeed?: mongoose.Types.Array<MemorySpeedDoc>
  pcieSlots?: mongoose.Types.Array<PcieSlotsDoc>
  usbSlots?: mongoose.Types.Array<UsbSlotsDoc>
  sataSlots?: mongoose.Types.Array<SataSlotsDoc>
  wirelessNetworking?: string
  onBoardVideo?: string
  sliCrossFire?: boolean
  ramSlot?: number
  onboardEthernet?: string
  supportEcc?: boolean
  raidSupport?: boolean
}

interface MotherBoardModel extends mongoose.PaginateModel<MotherboardDoc> {
  build(attrs: MotherboardAttrs): MotherboardDoc
}

const motherboardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cpuSocket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CpuSocket',
    },
    formFactor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FormFactor',
    },
    chipset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chipset',
    },
    memoryType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MemoryType',
    },
    memorySpeed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MemorySpeed',
      },
    ],
    pcieSlots: {
      type: mongoose.Schema.Types.Array,
      ref: 'PcieSlots',
    },
    usbSlots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsbSlots',
      },
    ],
    sataSlots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SataSlots',
      },
    ],
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manufacturer',
    },
    itemCode: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemCode',
      },
    ],
    itemImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Images',
      },
    ],
    measurements: {
      length: {
        type: Number,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      dimension: {
        type: String,
      },
    },
    wirelessNetworking: {
      type: String,
    },
    onBoardVideo: {
      type: String,
    },
    sliCrossFire: {
      type: Boolean,
    },
    ramSlot: {
      type: Number,
    },
    onboardEthernet: {
      type: String,
    },
    supportEcc: {
      type: Boolean,
    },
    raidSupport: {
      type: Boolean,
    },
    publish: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

motherboardSchema.plugin(mongoosePaginate)

motherboardSchema.statics.build = (attrs: MotherboardAttrs) => {
  return new MotherBoard(attrs)
}

const MotherBoard = mongoose.model<MotherboardDoc, MotherBoardModel>(
  'MotherBoard',
  motherboardSchema
)

export { MotherBoard }
