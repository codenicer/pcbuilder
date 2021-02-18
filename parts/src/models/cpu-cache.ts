import mongoose from 'mongoose'

interface CpuCacheAttrs {
  value: {
    name: string
    info: string
  }
}

export interface CpuCacheDoc extends mongoose.Document {
  value: {
    name: string
    info: string
  }
}

interface CpuCacheModel extends mongoose.Model<CpuCacheDoc> {
  build(attrs: CpuCacheAttrs): CpuCacheDoc
}

const cpuCacheSchema = new mongoose.Schema(
  {
    value: {
      type: {
        name: String,
        info: String,
      },
      required: true,
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

cpuCacheSchema.statics.build = (attrs: CpuCacheAttrs) => {
  return new CpuCache(attrs)
}

const CpuCache = mongoose.model<CpuCacheDoc, CpuCacheModel>(
  'CpuCache',
  cpuCacheSchema
)

export { CpuCache }
