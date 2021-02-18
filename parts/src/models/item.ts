import { ImagesDoc } from './images'
import { ItemCodeDoc } from './item-code'
import { ManufacturerDoc } from './manufacturer'

import mongoose from 'mongoose'
import { ItemTypeDoc } from './item-types'

export interface ItemAttrs {
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

export interface ItemDoc extends mongoose.Document {
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
  publish: boolean
}
