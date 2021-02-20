import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { CpuSocketDoc } from './cpu-socket'
import { ItemsDoc } from './items'

interface CpuCoolerAttrs {
  itemInfo: ItemsDoc
  cpuSocket?: mongoose.Types.Array<CpuSocketDoc>
  coolerModel?: string
  fanRpm?: {
    min: number
    max: number
  }
  noiceLevel?: {
    min: number
    max: number
  }
  bearing?: string
  waterCooled?: boolean
  fanless?: boolean
}

interface CpuCoolerDoc extends mongoose.Document {
  itemInfo: ItemsDoc
  cpuSocket: mongoose.Types.Array<CpuSocketDoc>
  coolerModel: string
  fanRpm: {
    min: number
    max: number
  }
  noiceLevel: {
    min: number
    max: number
  }
  bearing: string
  waterCooled: boolean
  fanless: boolean
}

interface CpuCoolerModel extends mongoose.PaginateModel<CpuCoolerDoc> {
  build(attrs: CpuCoolerAttrs): CpuCoolerDoc
}

const cpuCoolerSchema = new mongoose.Schema(
  {
    itemInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items',
      required: true,
    },
    cpuSocket: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CpuSocket',
      },
    ],
    coolerModel: {
      type: String,
    },
    bearing: {
      type: String,
    },
    fanRpm: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    noiceLevel: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    waterCooled: {
      type: Boolean,
    },
    fanless: {
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

cpuCoolerSchema.plugin(mongoosePaginate)

cpuCoolerSchema.statics.build = (attr: CpuCoolerAttrs) => {
  return new CpuCooler(attr)
}

const CpuCooler = mongoose.model<CpuCoolerDoc, CpuCoolerModel>(
  'CpuCooler',
  cpuCoolerSchema
)

export { CpuCooler }
