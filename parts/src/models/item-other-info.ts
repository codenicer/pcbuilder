import mongoose from 'mongoose'
import { ColorDoc } from './colors'
import { ManufacturerDoc } from './manufacturer'
import { ItemCodeDoc } from './item-code'
import { ItemTypeDoc } from './item-types'

interface ItemOtherInfoAttrs {
  itemType: ItemTypeDoc
  manufacture?: ManufacturerDoc
  itemCode?: ItemCodeDoc
  color?: ColorDoc
  itemImage: string
  length?: number
  height?: number
  dimension?: string
}

interface ItemOtherInfoDoc extends mongoose.Document {
  itemType: ItemTypeDoc
  manufacture?: ManufacturerDoc
  itemCode?: ItemCodeDoc
  color?: ColorDoc
  itemImage: string
  length?: number
  height?: number
  dimension?: string
}

interface ItemOtherInfoModel extends mongoose.Model<ItemOtherInfoDoc> {
  build(attrs: ItemOtherInfoAttrs): ItemOtherInfoDoc
}

const itemOtherInfoModelSchema = new mongoose.Schema(
  {
    itemType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemType',
      required: true,
    },
    manufacture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manufacturer',
    },
    itemCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemCode',
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
    itemImage: {
      type: String,
    },
    length: {
      type: Number,
    },
    height: {
      type: Number,
    },
    dimension: {
      type: String,
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

itemOtherInfoModelSchema.statics.build = (attrs: ItemOtherInfoAttrs) => {
  return new ItemOtherInfo(attrs)
}

const ItemOtherInfo = mongoose.model<ItemOtherInfoDoc, ItemOtherInfoModel>(
  'ItemOtherInfo',
  itemOtherInfoModelSchema
)

export { ItemOtherInfo }
