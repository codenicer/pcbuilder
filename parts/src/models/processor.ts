import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { CpuSeriesDoc } from './cpu-series'
import { CpuCacheDoc } from './cpu-cache'
import { ItemAttrs, ItemDoc } from './item'

interface ProcessorAttrs extends ItemAttrs {
  name: string
  series?: CpuSeriesDoc
  caches?: mongoose.Types.Array<CpuCacheDoc>
  coreFamily?: string
  integratedGraphic?: string
  microarchitecture?: string
  cpuModel?: string
  packaging?: string
  lithograpy?: string
  coreCount?: number
  threadCount?: number
  coreClock?: number
  boostClock?: number
  tdp?: number
  maxSupportedMemory?: number
  eccSupport?: boolean
  includesCpuCooler?: boolean
  multithreading?: boolean
}

export interface ProcessorDoc extends ItemDoc {
  name: string
  series: CpuSeriesDoc
  caches: mongoose.Types.Array<CpuCacheDoc>
  coreFamily: string
  integratedGraphic: string
  microarchitecture: string
  cpuModel: string
  packaging: string
  lithograpy: string
  coreCount: number
  threadCount: number
  coreClock: number
  boostClock: number
  tdp: number
  maxSupportedMemory: number
  eccSupport: boolean
  includesCpuCooler: boolean
  multithreading: boolean
}

interface ProcessorModel extends mongoose.PaginateModel<ProcessorDoc> {
  build(attr: ProcessorAttrs): ProcessorDoc
}

const ProcessorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CpuSeries',
    },
    caches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CpuCache',
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
    coreFamily: {
      type: String,
    },
    integratedGraphic: {
      type: String,
    },
    microarchitecture: {
      type: String,
    },
    cpuModel: {
      type: String,
    },
    packaging: {
      type: String,
    },
    lithograpy: {
      type: String,
    },
    coreCount: {
      type: Number,
    },
    threadCount: {
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
    maxSupportedMemory: {
      type: Number,
    },
    eccSupport: {
      type: Boolean,
    },
    includesCpuCooler: {
      type: Boolean,
    },
    multithreading: {
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

ProcessorSchema.plugin(mongoosePaginate)

ProcessorSchema.statics.build = (attrs: ProcessorAttrs) => {
  return new Processor(attrs)
}

const Processor = mongoose.model<ProcessorDoc, ProcessorModel>(
  'Processor',
  ProcessorSchema
)

export { Processor }
