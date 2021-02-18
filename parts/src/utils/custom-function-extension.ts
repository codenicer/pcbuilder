import { body } from 'express-validator'

interface Values {
  name: string
  count: number
}

interface TwoKey {
  name: string
  type: string
}

function customChecker(val: any, firstKey: TwoKey, secondKey: TwoKey): boolean {
  if (
    !val.hasOwnProperty(firstKey.name) ||
    !val.hasOwnProperty(secondKey.name)
  ) {
    return false
  } else {
    if (
      typeof val[firstKey.name] !== firstKey.type ||
      typeof val[secondKey.name] !== secondKey.type
    ) {
      return false
    }
  }
  return true
}

function validateArrayofObjects(vals: Values[]): boolean {
  if (vals.length < 1) {
    return false
  }

  for (let val of vals) {
    return customChecker(
      val,
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'count',
        type: 'number',
      }
    )
  }
  return true
}

function validateArrayOfStrings(vals: string[]): boolean {
  if (vals.length < 1) return false

  for (let val of vals) {
    if (typeof val !== 'string') return false
  }
  return true
}

function checkMinMax(val: any): boolean {
  if (typeof val !== 'object') return false
  if (val.min > val.max) return false
  return customChecker(
    val,
    {
      name: 'min',
      type: 'number',
    },
    {
      name: 'max',
      type: 'number',
    }
  )
}

function checkManufacturerBody(val: any): boolean {
  return customChecker(
    val,
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'info',
      type: 'string',
    }
  )
}

function checkImagesBody(vals: any) {
  if (vals.length < 1) {
    return false
  }

  for (let val of vals) {
    return customChecker(
      val,
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'url',
        type: 'string',
      }
    )
  }
  return true
}

function checkMeasurementBody(val: any): boolean {
  const alltrue: boolean[] = []

  alltrue.push(
    val.hasOwnProperty('length') && typeof val['length'] === 'number'
  )

  alltrue.push(val.hasOwnProperty('width') && typeof val['width'] === 'number')

  alltrue.push(
    val.hasOwnProperty('height') && typeof val['height'] === 'number'
  )
  alltrue.push(
    val.hasOwnProperty('dimension') && typeof val['dimension'] === 'string'
  )

  return !alltrue.includes(false)
}

const mandatoryItemRequimentsBodyChecker = [
  body('manufacturer')
    .optional()
    .notEmpty()
    .custom(checkManufacturerBody)
    .withMessage('Manufacturer must be have a name and info'),
  body('itemCode')
    .optional()
    .isArray()
    .custom(validateArrayOfStrings)
    .withMessage('Item code must be string'),
  body('itemImages')
    .optional()
    .isArray()
    .custom(checkImagesBody)
    .withMessage('Images must be array of object with a key of name and url'),
  body('measurements')
    .optional()
    .custom(checkMeasurementBody)
    .withMessage(
      'Measurement must be object with alteast key of lenght, height, width or dimension '
    ),
]

export {
  mandatoryItemRequimentsBodyChecker,
  validateArrayofObjects,
  validateArrayOfStrings,
  checkManufacturerBody,
  checkImagesBody,
  checkMeasurementBody,
  checkMinMax,
}
