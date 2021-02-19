// import { ImagesDoc } from './images'
// import { ItemCodeDoc } from './item-code'
// import { ManufacturerDoc } from './manufacturer'

// import mongoose from 'mongoose'

// export interface ItemAttrs {
//   manufacturer?: ManufacturerDoc
//   itemCode?: mongoose.Types.Array<ItemCodeDoc>
//   itemImages?: mongoose.Types.Array<ImagesDoc>
//   itemType?: ItemTypeDoc
//   measurements?: {
//     length?: number
//     width?: number
//     height?: number
//     dimension?: string
//   }
// }

// export interface ItemDoc extends mongoose.Document {
//   manufacturer: ManufacturerDoc
//   itemCode: mongoose.Types.Array<ItemCodeDoc>
//   itemImages: mongoose.Types.Array<ImagesDoc>
//   itemType: ItemTypeDoc
//   measurements: {
//     length: number
//     width: number
//     height: number
//     dimension: string
//   }
//   publish: boolean
// }

import mongoose from 'mongoose'
import { ImagesDoc } from './images'
import { ItemCodeDoc } from './item-code'
import { ManufacturerDoc } from './manufacturer'
import { ItemTypeDoc } from './item-types'
import mongoosePaginate from 'mongoose-paginate-v2'

interface ItemsAttrs {
  name: string
  manufacturer?: ManufacturerDoc
  itemCode?: mongoose.Types.Array<ItemCodeDoc>
  itemImages?: mongoose.Types.Array<ImagesDoc>
  itemType?: ItemTypeDoc
  measurements?: {
    length?: number
    width?: number
    height?: number
    dimension?: string
  }
}

export interface ItemsDoc extends mongoose.Document {
  name: string
  manufacturer: ManufacturerDoc
  itemCode: mongoose.Types.Array<ItemCodeDoc>
  itemImages: mongoose.Types.Array<ImagesDoc>
  itemType: ItemTypeDoc
  measurements: {
    length: number
    width: number
    height: number
    dimension: string
  }
  createdAt: Date
  updatedAt: Date
  publish: boolean
}

interface ItemsModel extends mongoose.PaginateModel<ItemsDoc> {
  build(attrs: ItemsAttrs): ItemsDoc
}

const itemsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    itemType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemType',
    },
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
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    publish: {
      type: Boolean,
      required: true,
      default: false,
    },
    casing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Casing',
    },
    memory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Memory',
    },
    motherboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MotherBoard',
    },
    opticalDrive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OpticalDrive',
    },
    powerSupply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PowerSupply',
    },
    processor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Processor',
    },
    storage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Storage',
    },
    videoCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoCard',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
    timestamps: true,
  }
)

itemsSchema.statics.build = (attrs: ItemsAttrs) => {
  return new Items(attrs)
}

itemsSchema.plugin(mongoosePaginate)

const Items = mongoose.model<ItemsDoc, ItemsModel>('Items', itemsSchema)

export { Items }
