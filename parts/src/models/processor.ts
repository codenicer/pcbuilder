import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { CpuSeriesDoc } from './cpu-series'
import { CpuCacheDoc } from './cpu-cache'
import { ItemsDoc } from './items'

interface ProcessorAttrs {
  itemInfo: ItemsDoc
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

export interface ProcessorDoc extends mongoose.Document {
  itemInfo: ItemsDoc
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
    itemInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items',
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
