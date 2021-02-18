import mongoose from 'mongoose'
import mongooosePaginate from 'mongoose-paginate-v2'
import { FormFactorDoc } from './form-factor'
import { InterfacesDoc } from './interface'
import { ItemAttrs, ItemDoc } from './item'

interface OpticalDriveAttrs extends ItemAttrs {
  name: string
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

interface OpticalDriveDoc extends ItemDoc {
  name: string
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
    name: {
      type: String,
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
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manufacturer',
    },
    itemCode: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemCode',
      },
    ],
    itemImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Images',
      },
    ],
    measurements: {
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
        type: String,
      },
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
