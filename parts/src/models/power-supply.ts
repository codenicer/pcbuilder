import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { FormFactorDoc } from './form-factor'
import { ItemsDoc } from './items'
import { PowerSupplyConnectorDoc } from './power-supply-connector'

interface PowerSupplyAttrs {
  itemInfo: ItemsDoc
  formFactor?: FormFactorDoc
  psuConnectors?: mongoose.Types.Array<PowerSupplyConnectorDoc>
  efficiencyRating?: string
  modular?: string
  type?: string
  wattage?: number
  fanless?: boolean
}

export interface PowerSupplyDoc extends mongoose.Document {
  itemInfo: ItemsDoc
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
    itemInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items',
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
