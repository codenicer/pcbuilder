import mongoose from 'mongoose'

interface ItemTypeAttrs {
  name: string
}

export interface ItemTypeDoc extends mongoose.Document {
  name: string
}

interface ItemTypeModel extends mongoose.Model<ItemTypeDoc> {
  build(attrs: ItemTypeAttrs): ItemTypeDoc
}

const itemTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specification: {
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

itemTypeSchema.statics.build = (attrs: ItemTypeAttrs) => {
  return new ItemType(attrs)
}

const ItemType = mongoose.model<ItemTypeDoc, ItemTypeModel>(
  'ItemType',
  itemTypeSchema
)

export { ItemType }
