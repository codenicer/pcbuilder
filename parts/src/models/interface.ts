import mongoose from 'mongoose'
import { InterfacesType } from '@cnpcbuilder/common'

interface InterfacesAttrs {
  name: string
  type: InterfacesType
}

export interface InterfacesDoc extends mongoose.Document {
  name: string
  type: InterfacesType
}

interface InterfacesModel extends mongoose.Model<InterfacesDoc> {
  build(attrs: InterfacesAttrs): InterfacesDoc
}

const interfacesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(InterfacesType),
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

interfacesSchema.statics.build = (attrs: InterfacesAttrs) => {
  return new Interfaces(attrs)
}

const Interfaces = mongoose.model<InterfacesDoc, InterfacesModel>(
  'Interfaces',
  interfacesSchema
)

export { Interfaces }
