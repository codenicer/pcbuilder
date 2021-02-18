import mongoose, { PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { VoidExpression } from 'typescript'

import { ChipsetDoc } from './chipset'
import { InterfacesDoc } from './interface'
import { ItemAttrs, ItemDoc } from './item'
import { MemoryTypeDoc } from './memory-type'
import { PortTypeDoc } from './port-type'
import { SliCrossfireTypeDoc } from './sli-crossfire-type'

interface VideoCardAttrs extends ItemAttrs {
  name: string
  chipset?: ChipsetDoc
  memoryType?: MemoryTypeDoc
  interfaces?: InterfacesDoc
  sliCrossfireType?: SliCrossfireTypeDoc
  ports?: mongoose.Types.Array<PortTypeDoc>
  frameSync?: string
  cooling?: string
  externalPower?: string
  memory?: number
  coreClock?: number
  boostClock?: number
  tdp?: number
  effectiveMemoryClock?: number
  expansionSlotWidth?: number
}

export interface VideoCardDoc extends ItemDoc {
  name: string
  chipset: ChipsetDoc
  memoryType: MemoryTypeDoc
  interfaces: InterfacesDoc
  sliCrossfireType: SliCrossfireTypeDoc
  ports: mongoose.Types.Array<PortTypeDoc>
  frameSync: string
  cooling: string
  externalPower: string
  memory: number
  coreClock: number
  boostClock: number
  tdp: number
  effectiveMemoryClock: number
  expansionSlotWidth: number
}

interface VideoCardModel extends mongoose.PaginateModel<VideoCardDoc> {
  build(attrs: VideoCardAttrs): VideoCardDoc
}

const videoCardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    chipset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chipset',
    },
    memoryType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MemoryType',
    },
    interfaces: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interfaces',
    },
    sliCrossfireType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SliCrossfireType',
    },
    ports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PortType',
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
    frameSync: {
      type: String,
    },
    cooling: {
      type: String,
    },
    externalPower: {
      type: String,
    },
    memory: {
      type: Number,
    },
    coreClock: {
      type: Number,
    },
    boostClock: {
      type: Number,
    },
    tdp: {
      type: Number,
    },
    effectiveMemoryClock: {
      type: Number,
    },
    expansionSlotWidth: {
      type: Number,
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

videoCardSchema.statics.build = (attrs: VideoCardAttrs) => {
  return new VideoCard(attrs)
}

videoCardSchema.plugin(mongoosePaginate)

const VideoCard = mongoose.model<VideoCardDoc, VideoCardModel>(
  'VideoCard',
  videoCardSchema
)

export { VideoCard }
