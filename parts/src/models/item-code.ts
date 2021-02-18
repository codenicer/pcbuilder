import mongoose from 'mongoose'

interface ItemCodeAttrs {
  code: string
}

export interface ItemCodeDoc extends mongoose.Document {
  code: string
}

interface ItemCodeModel extends mongoose.Model<ItemCodeDoc> {
  build(attrs: ItemCodeAttrs): ItemCodeDoc
}

const itemCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
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

itemCodeSchema.statics.build = (attrs: ItemCodeAttrs) => {
  return new ItemCode(attrs)
}

const ItemCode = mongoose.model<ItemCodeDoc, ItemCodeModel>(
  'ItemCode',
  itemCodeSchema
)

export { ItemCode }
