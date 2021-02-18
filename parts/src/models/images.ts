import mongoose from 'mongoose'

interface ImagesAttrs {
  name: string
  url: string
}

export interface ImagesDoc extends mongoose.Document {
  name: string
  url: string
}

interface ImagesModel extends mongoose.Model<ImagesDoc> {
  build(attrs: ImagesAttrs): ImagesDoc
}

const imagesSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    name: {
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

imagesSchema.statics.build = (attrs: ImagesAttrs) => {
  return new Images(attrs)
}

const Images = mongoose.model<ImagesDoc, ImagesModel>('Images', imagesSchema)

export { Images }
