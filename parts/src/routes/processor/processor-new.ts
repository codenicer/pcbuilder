import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@cnpcbuilder/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { CpuCache } from '../../models/cpu-cache'
import { CpuSeries } from '../../models/cpu-series'
import { Images } from '../../models/images'
import { ItemCode } from '../../models/item-code'
import { Items } from '../../models/items'
import { Manufacturer } from '../../models/manufacturer'
import { Processor } from '../../models/processor'
import {
  checkImagesBody,
  checkManufacturerBody,
  checkMeasurementBody,
  mandatoryItemRequimentsBodyChecker,
} from '../../utils/custom-function-extension'

const router = express.Router()

router.post(
  '/api/parts/processor',
  requireAuth,
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Processor name must be define'),
    body('series')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Series must be string'),
    body('caches')
      .optional()
      .isArray()
      .custom((vals) => {
        if (vals.length < 1) {
          return false
        }

        for (let val of vals) {
          if (!val.hasOwnProperty('name') || !val.hasOwnProperty('info')) {
            return false
          } else {
            if (typeof val.name !== 'string' || typeof val.info !== 'string') {
              return false
            }
          }
        }
        return true
      })
      .withMessage('Cache must be array of object with a key of name and info'),
    body('coreFamily')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Core family must be string'),
    body('integratedGraphic')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Integrated graphic must be string'),
    body('microarchitecture')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Microarchitecture must be string'),
    body('cpuModel')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Cpu Model must be string'),
    body('packaging')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Packaging must be string'),
    body('lithograpy')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Lithograpy must be string'),
    body('coreCount')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Core count must be numeric'),
    body('threadCount')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Thread count must be numeric'),
    body('coreClock')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Core clock must be numeric'),
    body('boostClock')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Boost clock must be numeric'),
    body('tdp')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Tdp must be numeric'),
    body('maxSupportedMemory')
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage('Maximum pupported memory must be numeric'),
    body('eccSupport')
      .optional()
      .notEmpty()
      .isBoolean()
      .withMessage('Ecc support must be boolean'),
    body('includesCpuCooler')
      .optional()
      .notEmpty()
      .isBoolean()
      .withMessage('Includes cpu cooler must be boolean'),
    body('multithreading')
      .optional()
      .notEmpty()
      .isBoolean()
      .withMessage('Multithreading cpu cooler must be boolean'),
    ...mandatoryItemRequimentsBodyChecker,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      series,
      caches,
      coreFamily,
      integratedGraphic,
      microarchitecture,
      cpuModel,
      packaging,
      lithograpy,
      coreCount,
      threadCount,
      coreClock,
      boostClock,
      tdp,
      maxSupportedMemory,
      eccSupport,
      includesCpuCooler,
      multithreading,
      manufacturer,
      itemCode,
      itemImages,
      measurements,
    } = req.body

    const isAlreadyExist = await Items.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    const newItems = Items.build({
      name,
      measurements,
    })

    if (manufacturer) {
      const manufacturerIsAlreadyExist = await Manufacturer.findOne({
        name: manufacturer.name,
      })

      if (manufacturerIsAlreadyExist) {
        newItems.manufacturer = manufacturerIsAlreadyExist
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        newItems.manufacturer = newManufacturer
      }
    }

    if (itemCode) {
      for (let code of itemCode) {
        const itemCodeIsAlreadyExist = await ItemCode.findOne({
          code: code,
        })

        if (itemCodeIsAlreadyExist) {
          newItems.itemCode.addToSet(itemCodeIsAlreadyExist)
        } else {
          const newItemCode = ItemCode.build({
            code: code,
          })

          await newItemCode.save()
          newItems.itemCode.addToSet(newItemCode)
        }
      }
    }

    if (itemImages) {
      for (let itemImage of itemImages) {
        let itemImageIsAlreadyExist = await Images.findOne({
          name: itemImage.name,
          url: itemImage.url,
        })

        if (itemImageIsAlreadyExist) {
          newItems.itemImages?.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          newItems.itemImages?.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    const processor = Processor.build({
      itemInfo: newItems,
      coreFamily,
      integratedGraphic,
      microarchitecture,
      cpuModel,
      packaging,
      lithograpy,
      coreCount,
      threadCount,
      coreClock,
      boostClock,
      tdp,
      maxSupportedMemory,
      eccSupport,
      includesCpuCooler,
      multithreading,
    })

    if (series) {
      const seriesIsAlreadyExist = await CpuSeries.findOne({
        name: series,
      })

      if (seriesIsAlreadyExist) {
        processor.series = seriesIsAlreadyExist
      } else {
        const newCpuSeries = CpuSeries.build({
          name: series,
        })

        await newCpuSeries.save()

        processor.series = newCpuSeries
      }
    }

    if (caches) {
      for (let cache of caches as [{ name: string; info: string }]) {
        let cacheIsAlreadyExist = await CpuCache.findOne({
          value: {
            name: cache.name,
            info: cache.info,
          },
        })

        if (cacheIsAlreadyExist) {
          processor.caches?.addToSet(cacheIsAlreadyExist)
        } else {
          let newCpuCache = CpuCache.build({
            value: {
              name: cache.name,
              info: cache.info,
            },
          })

          await newCpuCache.save()

          processor.caches?.addToSet(cacheIsAlreadyExist)
        }
      }
    }

    await processor.save()
    res.status(201).send(processor)
  }
)

export { router as NewProcessorRouter }
