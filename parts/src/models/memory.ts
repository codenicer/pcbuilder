import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { ItemsDoc } from './items'
import { MemorySpeedDoc } from './memory-speed'
import { MemoryTypeDoc } from './memory-type'

interface MemoryAttrs {
  itemInfo: ItemsDoc
  memorySpeed?: MemorySpeedDoc
  memoryType?: MemoryTypeDoc
  module?: string
  timing?: string
  casLatency?: number
  pricePerGb?: number
  voltage?: number
  heatSpreader?: boolean
}

export interface MemoryDoc extends mongoose.Document {
  itemInfo: ItemsDoc
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
    itemInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items',
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
