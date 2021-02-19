import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
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
import { mandatoryItemRequimentsBodyChecker } from '../../utils/custom-function-extension'

const router = express.Router()

router.patch(
  '/api/parts/processor/:id',
  requireAuth,
  [
    body('name')
      .optional()
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
    body('publish')
      .optional()
      .isBoolean()
      .withMessage('Publish must be boolean'),
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
      publish,
      manufacturer,
      itemCode,
      itemImages,
      measurements,
    } = req.body

    const { id } = req.params

    const processorDoesExist = await Processor.findById(id)

    if (!processorDoesExist) {
      throw new NotFoundError()
    }

    const itemInfo = await Items.findById({ _id: processorDoesExist?.itemInfo })

    if (!itemInfo) {
      throw new NotFoundError()
    }

    const isAlreadyExist = await Items.findOne({ name })

    if (isAlreadyExist) {
      throw new BadRequestError('Name is already exist')
    }

    if (name) itemInfo.set({ name })
    if (coreFamily) processorDoesExist.set({ coreFamily })
    if (integratedGraphic) processorDoesExist.set({ integratedGraphic })
    if (microarchitecture) processorDoesExist.set({ microarchitecture })
    if (cpuModel) processorDoesExist.set({ cpuModel })
    if (packaging) processorDoesExist.set({ packaging })
    if (lithograpy) processorDoesExist.set({ lithograpy })
    if (coreCount) processorDoesExist.set({ coreCount })
    if (threadCount) processorDoesExist.set({ threadCount })
    if (coreClock) processorDoesExist.set({ coreClock })
    if (boostClock) processorDoesExist.set({ boostClock })
    if (tdp) processorDoesExist.set({ tdp })
    if (maxSupportedMemory) processorDoesExist.set({ maxSupportedMemory })
    if (typeof eccSupport === 'boolean') processorDoesExist.set({ eccSupport })
    if (typeof includesCpuCooler === 'boolean')
      processorDoesExist.set({ includesCpuCooler })
    if (typeof multithreading === 'boolean')
      processorDoesExist.set({ multithreading })
    if (tdp) processorDoesExist.set({ tdp })
    if (typeof publish === 'boolean') itemInfo.set({ publish })
    if (measurements) itemInfo.set({ measurements })

    if (series) {
      const seriesIsAlreadyExist = await CpuSeries.findOne({
        name: series,
      })

      if (seriesIsAlreadyExist) {
        processorDoesExist.series = seriesIsAlreadyExist
      } else {
        const newCpuSeries = CpuSeries.build({
          name: series,
        })

        await newCpuSeries.save()

        processorDoesExist.series = newCpuSeries
      }
    }

    if (caches) {
      processorDoesExist.set({ caches: [] })

      for (let cache of caches as [{ name: string; info: string }]) {
        let cacheIsAlreadyExist = await CpuCache.findOne({
          value: {
            name: cache.name,
            info: cache.info,
          },
        })

        if (cacheIsAlreadyExist) {
          processorDoesExist.caches?.addToSet(cacheIsAlreadyExist)
        } else {
          let newCpuCache = CpuCache.build({
            value: {
              name: cache.name,
              info: cache.info,
            },
          })

          await newCpuCache.save()

          processorDoesExist.caches?.addToSet(newCpuCache)
        }
      }
    }

    if (manufacturer) {
      const manufacturerIsAlreadyExist = await Manufacturer.findOne({
        name: manufacturer.name,
      })

      if (manufacturerIsAlreadyExist) {
        itemInfo.manufacturer = manufacturerIsAlreadyExist
      } else {
        const newManufacturer = Manufacturer.build({
          name: manufacturer.name,
          info: manufacturer.info,
        })

        await newManufacturer.save()
        itemInfo.manufacturer = newManufacturer
      }
    }

    if (itemCode) {
      itemInfo.set({ itemCode: [] })

      for (let code of itemCode) {
        const itemCodeIsAlreadyExist = await ItemCode.findOne({
          code: code,
        })

        if (itemCodeIsAlreadyExist) {
          itemInfo.itemCode.addToSet(itemCodeIsAlreadyExist)
        } else {
          const newItemCode = ItemCode.build({
            code: code,
          })

          await newItemCode.save()
          itemInfo.itemCode.addToSet(newItemCode)
        }
      }
    }

    if (itemImages) {
      itemInfo.set({ itemImages: [] })

      for (let itemImage of itemImages) {
        let itemImageIsAlreadyExist = await Images.findOne({
          name: itemImage.name,
          url: itemImage.url,
        })

        if (itemImageIsAlreadyExist) {
          itemInfo.itemImages?.addToSet(itemImageIsAlreadyExist)
        } else {
          let newImage = Images.build({
            name: itemImage.name,
            url: itemImage.url,
          })

          await newImage.save()

          itemInfo.itemImages?.addToSet(itemImageIsAlreadyExist)
        }
      }
    }

    await itemInfo.save()

    await processorDoesExist.save()

    await processorDoesExist
      .populate('series')
      .populate('caches')
      .populate({
        path: 'itemInfo',
        model: 'Items',
        populate: [
          {
            path: 'manufacturer',
            model: 'Manufacturer',
          },
          {
            path: 'itemCode',
            model: 'ItemCode',
          },
          {
            path: 'itemImages',
            model: 'Images',
          },
          {
            path: 'itemType',
            model: 'ItemType',
          },
        ],
      })
      .execPopulate()

    res.status(200).send(processorDoesExist)
  }
)

export { router as EditProcessorRouter }
