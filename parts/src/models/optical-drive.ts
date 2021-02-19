import mongoose from 'mongoose'
import mongooosePaginate from 'mongoose-paginate-v2'
import { FormFactorDoc } from './form-factor'
import { InterfacesDoc } from './interface'
import { ItemsDoc } from './items'
interface OpticalDriveAttrs {
  itemInfo: ItemsDoc
  interfaces?: InterfacesDoc
  formFactor?: FormFactorDoc
  bufferCache?: number
  bdRomSpeed?: number
  dvdRomSpeed?: number
  cdRomSpeed?: number
  dvdPositiveRDualLayerSpeed?: number
  dvdPositiveRSpeed?: number
  dvdPositiveRWSpeed?: number
  dvdNegativeRDualLayerSpeed?: number
  dvdNegativeRSpeed?: number
  dvdNegativeRAMSpeed?: number
  dvdNegativeRWSpeed?: number
  cdNegativeRSpeed?: number
  cdNegativeRWSpeed?: number
}

interface OpticalDriveDoc extends mongoose.Document {
  itemInfo: ItemsDoc
  interfaces: InterfacesDoc
  formFactor?: FormFactorDoc
  bufferCache?: number
  bdRomSpeed?: number
  dvdRomSpeed?: number
  cdRomSpeed?: number
  dvdPositiveRDualLayerSpeed?: number
  dvdPositiveRSpeed?: number
  dvdPositiveRWSpeed?: number
  dvdNegativeRDualLayerSpeed?: number
  dvdNegativeRSpeed?: number
  dvdNegativeRAMSpeed?: number
  dvdNegativeRWSpeed?: number
  cdNegativeRSpeed?: number
  cdNegativeRWSpeed?: number
}

interface OpticalDiveModel extends mongoose.PaginateModel<OpticalDriveDoc> {
  build(attrs: OpticalDriveAttrs): OpticalDriveDoc
}

const OpticalDriveSchema = new mongoose.Schema(
  {
    itemInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items',
      required: true,
    },
    bufferCache: {
      type: Number,
    },
    bdRomSpeed: {
      type: Number,
    },
    dvdRomSpeed: {
      type: Number,
    },
    cdRomSpeed: {
      type: Number,
    },
    dvdPositiveRDualLayerSpeed: {
      type: Number,
    },
    dvdPositiveRSpeed: {
      type: Number,
    },
    dvdPositiveRWSpeed: {
      type: Number,
    },
    dvdNegativeRDualLayerSpeed: {
      type: Number,
    },
    dvdNegativeRSpeed: {
      type: Number,
    },
    dvdNegativeRAMSpeed: {
      type: Number,
    },
    dvdNegativeRWSpeed: {
      type: Number,
    },
    cdNegativeRSpeed: {
      type: Number,
    },
    cdNegativeRWSpeed: {
      type: Number,
    },
    interfaces: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interfaces',
    },
    formFactor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FormFactor',
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

OpticalDriveSchema.plugin(mongooosePaginate)

OpticalDriveSchema.statics.build = (attrs: OpticalDriveAttrs) => {
  return new OpticalDrive(attrs)
}

const OpticalDrive = mongoose.model<OpticalDriveDoc, OpticalDiveModel>(
  'OpticalDrive',
  OpticalDriveSchema
)

export { OpticalDrive }
