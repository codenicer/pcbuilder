import mongoose from 'mongoose'

interface MemoryTypeAttrs {
  name: string
}

export interface MemoryTypeDoc extends mongoose.Document {
  name: string
}

interface MemoryTypeModel extends mongoose.Model<MemoryTypeDoc> {
  build(attrs: MemoryTypeAttrs): MemoryTypeDoc
}

const memoryTypeSchema = new mongoose.Schema(
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

memoryTypeSchema.statics.build = (attrs: MemoryTypeAttrs) => {
  return new MemoryType(attrs)
}

const MemoryType = mongoose.model<MemoryTypeDoc, MemoryTypeModel>(
  'MemoryType',
  memoryTypeSchema
)

export { MemoryType }
