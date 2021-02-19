import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { FormFactorDoc } from './form-factor'
import { InterfacesDoc } from './interface'
import { ItemsDoc } from './items'

interface StorageAttrs {
  itemInfo: ItemsDoc
  formFactor?: FormFactorDoc
  interfaces?: InterfacesDoc
  capacity?: number
  pricePerGb?: number
  type?: string
  isNvme?: boolean
}

export interface StorageDoc extends mongoose.Document {
  itemInfo: ItemsDoc
  name: string
  formFactor: FormFactorDoc
  interfaces: InterfacesDoc
  capacity: number
  pricePerGb: number
  type: string
  isNvme: boolean
}

interface StorageModel extends mongoose.PaginateModel<StorageDoc> {
  build(attrs: StorageAttrs): StorageDoc
}

const storageSchema = new mongoose.Schema(
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
    interfaces: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interfaces',
    },

    capacity: {
      type: Number,
    },
    pricePerGb: {
      type: Number,
    },
    type: {
      type: String,
    },
    isNvme: {
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

storageSchema.plugin(mongoosePaginate)

storageSchema.statics.build = (attrs: StorageAttrs) => {
  return new Storage(attrs)
}

const Storage = mongoose.model<StorageDoc, StorageModel>(
  'Storage',
  storageSchema
)

export { Storage }
