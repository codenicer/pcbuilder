import mongoose from 'mongoose'

interface PowerSupplyConnectorAttrs {
  value: {
    name: string
    count: number
  }
}

export interface PowerSupplyConnectorDoc extends mongoose.Document {
  value: {
    name: string
    count: number
  }
}

interface PowerSupplyConnectorModel
  extends mongoose.Model<PowerSupplyConnectorDoc> {
  build(attrs: PowerSupplyConnectorAttrs): PowerSupplyConnectorDoc
}

const powerSupplyConnectorSchema = new mongoose.Schema(
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

powerSupplyConnectorSchema.statics.build = (
  attrs: PowerSupplyConnectorAttrs
) => {
  return new PowerSupplyConnector(attrs)
}

const PowerSupplyConnector = mongoose.model<
  PowerSupplyConnectorDoc,
  PowerSupplyConnectorModel
>('PowerSupplyConnector', powerSupplyConnectorSchema)

export { PowerSupplyConnector }
