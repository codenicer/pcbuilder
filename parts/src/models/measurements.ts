import mongoose from 'mongoose'

interface MeasurementsAttrs {
  length?: number
  width?: number
  height?: number
  dimension?: string
}

export interface MeasurementsDoc extends mongoose.Document {
  length: number
  width: number
  height: number
  dimension: string
}

interface MeasurementsModel extends mongoose.Model<MeasurementsDoc> {
  build(attrs: MeasurementsAttrs): MeasurementsDoc
}

const MeasurementsSchema = new mongoose.Schema(
  {
    length: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    dimension: {
      type: Number,
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

MeasurementsSchema.statics.build = (attrs: MeasurementsAttrs) => {
  return new Measurements(attrs)
}

const Measurements = mongoose.model<MeasurementsDoc, MeasurementsModel>(
  'Measurements',
  MeasurementsSchema
)

export { Measurements }
