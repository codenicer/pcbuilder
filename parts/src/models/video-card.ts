import mongoose, { PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { VoidExpression } from 'typescript'

import { ChipsetDoc } from './chipset'
import { InterfacesDoc } from './interface'
import { ItemsDoc } from './items'
import { MemoryTypeDoc } from './memory-type'
import { PortTypeDoc } from './port-type'
import { SliCrossfireTypeDoc } from './sli-crossfire-type'

interface VideoCardAttrs {
  itemInfo: ItemsDoc
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

export interface VideoCardDoc extends mongoose.Document {
  itemInfo: ItemsDoc
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
    itemInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items',
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
