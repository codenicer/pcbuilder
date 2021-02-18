import mongoose from 'mongoose'

interface CpuSocketAttrs {
  name: string
}

export interface CpuSocketDoc extends mongoose.Document {
  name: string
}

interface CpuSocketModel extends mongoose.Model<CpuSocketDoc> {
  build(attrs: CpuSocketAttrs): CpuSocketDoc
}

const cpuSocketSchema = new mongoose.Schema(
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

cpuSocketSchema.statics.build = (attrs: CpuSocketAttrs) => {
  return new CpuSocket(attrs)
}

const CpuSocket = mongoose.model<CpuSocketDoc, CpuSocketModel>(
  'CpuSocket',
  cpuSocketSchema
)

export { CpuSocket }
