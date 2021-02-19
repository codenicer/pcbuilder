import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { FormFactorDoc } from './form-factor'
import { ItemsDoc } from './items'

interface CasingAttrs {
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
  itemInfo: ItemsDoc
}

interface CasingDoc extends mongoose.Document {
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
  itemInfo: ItemsDoc
}

interface CasingModel extends mongoose.PaginateModel<CasingDoc> {
  build(atrrs: CasingAttrs): CasingDoc
}

const casingSchema = new mongoose.Schema(
  {
    motherboardFromFactor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormFactor',
      },
    ],
    itemInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items',
      required: true,
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
