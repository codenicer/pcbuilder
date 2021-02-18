import mongoose from 'mongoose'

interface UsbSlotsAttrs {
  value: {
    name: string
    count: number
  }
}

export interface UsbSlotsDoc extends mongoose.Document {
  value: {
    name: string
    count: number
  }
}

interface UsbSlotsModel extends mongoose.Model<UsbSlotsDoc> {
  build(attrs: UsbSlotsAttrs): UsbSlotsDoc
}

const usbSlotsSchema = new mongoose.Schema(
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

usbSlotsSchema.statics.build = (attrs: UsbSlotsAttrs) => {
  return new UsbSlots(attrs)
}

const UsbSlots = mongoose.model<UsbSlotsDoc, UsbSlotsModel>(
  'UsbSlots',
  usbSlotsSchema
)

export { UsbSlots }
