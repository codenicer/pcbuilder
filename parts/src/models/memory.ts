import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { ItemAttrs, ItemDoc } from './item'
import { MemorySpeedDoc } from './memory-speed'
import { MemoryTypeDoc } from './memory-type'

interface MemoryAttrs extends ItemAttrs {
  name: string
  memorySpeed?: MemorySpeedDoc
  memoryType?: MemoryTypeDoc
  module?: string
  timing?: string
  casLatency?: number
  pricePerGb?: number
  voltage?: number
  heatSpreader?: boolean
}

export interface MemoryDoc extends ItemDoc {
  name: string
  memorySpeed: MemorySpeedDoc
  memoryType: MemoryTypeDoc
  module: string
  timing: string
  casLatency: number
  pricePerGb: number
  voltage: number
  heatSpreader: boolean
}

interface MemoryModel extends mongoose.PaginateModel<MemoryDoc> {
  build(attrs: MemoryAttrs): MemoryDoc
}

const memorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    memorySpeed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MemorySpeed',
    },
    memoryType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MemoryType',
    },

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
    module: {
      type: String,
    },
    timing: {
      type: String,
    },
    casLatency: {
      type: Number,
    },
    pricePerGb: {
      type: Number,
    },
    voltage: {
      type: Number,
    },
    heatSpreader: {
      type: Boolean,
    },
    pulish: {
      type: Boolean,
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

memorySchema.plugin(mongoosePaginate)

memorySchema.statics.build = (attrs: MemoryAttrs) => {
  return new Memory(attrs)
}

const Memory = mongoose.model<MemoryDoc, MemoryModel>('Memory', memorySchema)

export { Memory }
