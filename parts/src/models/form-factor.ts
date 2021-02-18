import mongoose from 'mongoose'

interface FormFactorAttrs {
  name: string
}

export interface FormFactorDoc extends mongoose.Document {
  name: string
}

interface FormFactorModel extends mongoose.Model<FormFactorDoc> {
  build(attrs: FormFactorAttrs): FormFactorDoc
}

const formFactorSchema = new mongoose.Schema(
  {
    name: {
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

formFactorSchema.statics.build = (attrs: FormFactorAttrs) => {
  return new FormFactor(attrs)
}

const FormFactor = mongoose.model<FormFactorDoc, FormFactorModel>(
  'FormFactor',
  formFactorSchema
)

export { FormFactor }
