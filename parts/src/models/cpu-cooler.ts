import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { CpuSocketDoc } from './cpu-socket'
import { ItemAttrs, ItemDoc } from './item'

interface CpuCoolerAttrs extends ItemAttrs {
  name: string
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

interface CpuCoolerDoc extends ItemDoc {
  name: string
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
    name: {
      type: String,
      required: true,
    },
    cpuSocket: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CpuSocket',
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

cpuCoolerSchema.plugin(mongoosePaginate)

cpuCoolerSchema.statics.build = (attr: CpuCoolerAttrs) => {
  return new CpuCooler(attr)
}

const CpuCooler = mongoose.model<CpuCoolerDoc, CpuCoolerModel>(
  'CpuCooler',
  cpuCoolerSchema
)

export { CpuCooler }
