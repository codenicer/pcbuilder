import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { FormFactorDoc } from './form-factor'
import { ItemAttrs, ItemDoc } from './item'

interface CasingAttrs extends ItemAttrs {
  name: string
  motherboardFromFactor?: mongoose.Types.Array<FormFactorDoc>
  caseFrontPannelUsb?: string[]
  maxVideoCardLength?: string[]
  volume?: string[]
  type?: string
  sidePanelWindow?: string
  powersupply?: string
  halfHeightExpansionSlot?: number
  fullHeightExpansionSlot?: number
  internal25Bays?: number
  internal35Bays?: number
}

interface CasingDoc extends ItemDoc {
  name: string
  motherboardFromFactor: mongoose.Types.Array<FormFactorDoc>
  caseFrontPannelUsb: string[]
  maxVideoCardLength: string[]
  volume: string[]
  type: string
  sidePanelWindow: string
  powersupply: string
  halfHeightExpansionSlot: number
  fullHeightExpansionSlot: number
  internal25Bays: number
  internal35Bays: number
}

interface CasingModel extends mongoose.PaginateModel<CasingDoc> {
  build(atrrs: CasingAttrs): CasingDoc
}

const casingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    chipset: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormFactor',
      },
    ],
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
    caseFrontPannelUsb: [
      {
        type: String,
      },
    ],
    maxVideoCardLength: [
      {
        type: String,
      },
    ],
    volume: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
    },
    sidePanelWindow: {
      type: String,
    },
    powersupply: {
      type: String,
    },
    halfHeightExpansionSlot: {
      type: Number,
    },
    fullHeightExpansionSlot: {
      type: Number,
    },
    internal25Bays: {
      type: Number,
    },
    internal35Bays: {
      type: Number,
    },
    publish: {
      type: Boolean,
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

casingSchema.plugin(mongoosePaginate)

casingSchema.statics.build = (attrs: CasingAttrs) => {
  return new Casing(attrs)
}

const Casing = mongoose.model<CasingDoc, CasingModel>('Casing', casingSchema)

export { Casing }
