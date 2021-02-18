import mongoose from 'mongoose'

interface SataSlotsAttrs {
  value: {
    name: string
    count: number
  }
}

export interface SataSlotsDoc extends mongoose.Document {
  value: {
    name: string
    count: number
  }
}

interface SataSlotsModel extends mongoose.Model<SataSlotsDoc> {
  build(attrs: SataSlotsAttrs): SataSlotsDoc
}

const sataSlotsSchema = new mongoose.Schema(
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

sataSlotsSchema.statics.build = (attrs: SataSlotsAttrs) => {
  return new SataSlots(attrs)
}

const SataSlots = mongoose.model<SataSlotsDoc, SataSlotsModel>(
  'SataSlots',
  sataSlotsSchema
)

export { SataSlots }
