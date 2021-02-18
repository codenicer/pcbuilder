import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { FormFactorDoc } from './form-factor'
import { InterfacesDoc } from './interface'
import { ItemAttrs, ItemDoc } from './item'
interface StorageAttrs extends ItemAttrs {
  name: string
  formFactor?: FormFactorDoc
  interfaces?: InterfacesDoc
  capacity?: number
  pricePerGb?: number
  type?: string
  isNvme?: boolean
}

export interface StorageDoc extends ItemDoc {
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
    name: {
      type: String,
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

storageSchema.plugin(mongoosePaginate)

storageSchema.statics.build = (attrs: StorageAttrs) => {
  return new Storage(attrs)
}

const Storage = mongoose.model<StorageDoc, StorageModel>(
  'Storage',
  storageSchema
)

export { Storage }
