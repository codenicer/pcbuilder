import mongoose from 'mongoose'

interface CpuSeriesAttrs {
  name: string
}

export interface CpuSeriesDoc extends mongoose.Document {
  name: string
}

interface CpuSeriesModel extends mongoose.Model<CpuSeriesDoc> {
  build(attrs: CpuSeriesAttrs): CpuSeriesDoc
}

const cpuSeriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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

cpuSeriesSchema.statics.build = (attrs: CpuSeriesAttrs) => {
  return new CpuSeries(attrs)
}

const CpuSeries = mongoose.model<CpuSeriesDoc, CpuSeriesModel>(
  'CpuSeries',
  cpuSeriesSchema
)

export { CpuSeries }
