import mongoose from 'mongoose'

export interface ManufacturerAttrs {
  name: string
  info?: string
}

export interface ManufacturerDoc extends mongoose.Document {
  name: string
  info?: string
}

interface ManufacturerModel extends mongoose.Model<ManufacturerDoc> {
  build(attrs: ManufacturerAttrs): ManufacturerDoc
}

const manufacturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    info: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._d
      },
    },
  }
)

manufacturerSchema.statics.build = (attrs: ManufacturerAttrs) => {
  return new Manufacturer(attrs)
}

const Manufacturer = mongoose.model<ManufacturerDoc, ManufacturerModel>(
  'Manufacturer',
  manufacturerSchema
)

export { Manufacturer }
