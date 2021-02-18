import mongoose from 'mongoose'

interface ChipsetAttrs {
  name: string
}

export interface ChipsetDoc extends mongoose.Document {
  name: string
}

interface ChipsetModel extends mongoose.Model<ChipsetDoc> {
  build(attrs: ChipsetAttrs): ChipsetDoc
}

const chipsetSchema = new mongoose.Schema(
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

chipsetSchema.statics.build = (attrs: ChipsetAttrs) => {
  return new Chipset(attrs)
}

const Chipset = mongoose.model<ChipsetDoc, ChipsetModel>(
  'Chipset',
  chipsetSchema
)

export { Chipset }
