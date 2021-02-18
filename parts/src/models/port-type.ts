import mongoose from 'mongoose'

interface PortTypeAttrs {
  value: {
    name: string
    count: number
  }
}

export interface PortTypeDoc extends mongoose.Document {
  value: {
    name: string
    count: number
  }
}

interface PortTypeModel extends mongoose.Model<PortTypeDoc> {
  build(attrs: PortTypeAttrs): PortTypeDoc
}

const portTypeSchema = new mongoose.Schema(
  {
    value: {
      type: {
        name: String,
        count: Number,
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

portTypeSchema.statics.build = (attrs: PortTypeAttrs) => {
  return new PortType(attrs)
}

const PortType = mongoose.model<PortTypeDoc, PortTypeModel>(
  'PortType',
  portTypeSchema
)

export { PortType }
