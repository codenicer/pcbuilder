import mongoose from 'mongoose'

interface SliCrossfireTypeAttrs {
  name: string
}

export interface SliCrossfireTypeDoc extends mongoose.Document {
  name: string
}

interface SliCrossfireTypeModel extends mongoose.Model<SliCrossfireTypeDoc> {
  build(attrs: SliCrossfireTypeAttrs): SliCrossfireTypeDoc
}

const sliCrossfireTypeSchema = new mongoose.Schema(
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

sliCrossfireTypeSchema.statics.build = (attrs: SliCrossfireTypeAttrs) => {
  return new SliCrossfireType(attrs)
}

const SliCrossfireType = mongoose.model<
  SliCrossfireTypeDoc,
  SliCrossfireTypeModel
>('SliCrossfireType', sliCrossfireTypeSchema)

export { SliCrossfireType }
