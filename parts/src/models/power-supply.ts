import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { FormFactorDoc } from './form-factor'
import { ItemAttrs, ItemDoc } from './item'
import { PowerSupplyConnectorDoc } from './power-supply-connector'

interface PowerSupplyAttrs extends ItemAttrs {
  name: string
  formFactor?: FormFactorDoc
  psuConnectors?: mongoose.Types.Array<PowerSupplyConnectorDoc>
  efficiencyRating?: string
  modular?: string
  type?: string
  wattage?: number
  fanless?: boolean
}

export interface PowerSupplyDoc extends ItemDoc {
  name: string
  formFactor: FormFactorDoc
  psuConnectors: mongoose.Types.Array<PowerSupplyConnectorDoc>
  efficiencyRating: string
  modular: string
  type: string
  wattage: number
  fanless: boolean
}

interface PowerSupplyModel extends mongoose.PaginateModel<PowerSupplyDoc> {
  build(attrs: PowerSupplyAttrs): PowerSupplyDoc
}

const powerSupplySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    formFactor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FormFactor',
    },
    psuConnectors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PowerSupplyConnector',
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
    efficiencyRating: {
      type: String,
    },
    modular: {
      type: String,
    },
    type: {
      type: String,
    },
    wattage: {
      type: Number,
    },
    fanless: {
      type: Boolean,
    },
    publish: {
      type: Boolean,
      required: true,
      default: false,
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

powerSupplySchema.plugin(mongoosePaginate)

powerSupplySchema.statics.build = (attrs: PowerSupplyAttrs) => {
  return new PowerSupply(attrs)
}

const PowerSupply = mongoose.model<PowerSupplyDoc, PowerSupplyModel>(
  'PowerSupply',
  powerSupplySchema
)

export { PowerSupply }
