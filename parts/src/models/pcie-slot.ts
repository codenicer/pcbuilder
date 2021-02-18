import mongoose from 'mongoose'

interface PcieSlotsAttrs {
  value: {
    name: string
    count: number
  }
}

export interface PcieSlotsDoc extends mongoose.Document {
  value: {
    name: string
    count: number
  }
}

interface PcieSlotsModel extends mongoose.Model<PcieSlotsDoc> {
  build(attrs: PcieSlotsAttrs): PcieSlotsDoc
}

const pcieSlotsSchema = new mongoose.Schema(
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

pcieSlotsSchema.statics.build = (attrs: PcieSlotsAttrs) => {
  return new PcieSlots(attrs)
}

const PcieSlots = mongoose.model<PcieSlotsDoc, PcieSlotsModel>(
  'PcieSlots',
  pcieSlotsSchema
)

export { PcieSlots }
