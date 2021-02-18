import mongoose from 'mongoose'
import { Colors } from '@cnpcbuilder/common'

interface ColorAttrs {
  color: Colors
}

export interface ColorDoc extends mongoose.Document {
  color: Colors
}

interface ColorModel extends mongoose.Model<ColorDoc> {
  build(attrs: ColorAttrs): ColorDoc
}

const colorSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      enum: Object.values(Colors),
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

colorSchema.statics.build = (attrs: ColorAttrs) => {
  return new Color(attrs)
}

const Color = mongoose.model<ColorDoc, ColorModel>('Color', colorSchema)

export { Color }
