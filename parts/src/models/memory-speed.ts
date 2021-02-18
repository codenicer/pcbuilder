import mongoose from 'mongoose'

interface MemorySpeedAttrs {
  name: string
}

export interface MemorySpeedDoc extends mongoose.Document {
  name: string
}

interface MemorySpeedModel extends mongoose.Model<MemorySpeedDoc> {
  build(attrs: MemorySpeedAttrs): MemorySpeedDoc
}

const memorySpeedSchema = new mongoose.Schema(
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

memorySpeedSchema.statics.build = (attrs: MemorySpeedAttrs) => {
  return new MemorySpeed(attrs)
}

const MemorySpeed = mongoose.model<MemorySpeedDoc, MemorySpeedModel>(
  'MemorySpeed',
  memorySpeedSchema
)

export { MemorySpeed }
