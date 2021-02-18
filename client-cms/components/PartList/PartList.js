import style from '../../styles/PartList.module.scss'

const PartList = () => {
  return (
    <div className={style.partListBody}>
      <ul className={style.partList}>
        <li className={style.part}>
          <div className={style.partContent}>
            <p
              className={`${style.partContentStatus} ${style.partStatusPublish}`}
            >
              Published
            </p>
            <p className={style.partContentType}>Processor</p>
            <h1 className={style.partContentName}>
              Intel i7-10700h 5.6ghz 2mb cache
            </h1>
            <p className={style.partContentManufacturer}>Intel</p>
            <button className={style.partViewButton}>View info</button>
          </div>
        </li>
        <li className={style.part}>
          <div className={style.partContent}>
            <p
              className={`${style.partContentStatus} ${style.partStatusNotPublish}`}
            >
              Unpublished
            </p>
            <p className={style.partContentType}>Casing</p>
            <h1 className={style.partContentName}>
              Cougar QBX mini-ITX computer case
            </h1>
            <p className={style.partContentManufacturer}>Cougar</p>
            <button className={style.partViewButton}>View info</button>
          </div>
        </li>
        <li className={style.part}>
          <div className={style.partContent}>
            <p
              className={`${style.partContentStatus} ${style.partStatusPublish}`}
            >
              Published
            </p>
            <p className={style.partContentType}>Processor</p>
            <h1 className={style.partContentName}>
              Intel i7-10700h 5.6ghz 2mb cache
            </h1>
            <p className={style.partContentManufacturer}>Intel</p>
            <button className={style.partViewButton}>View info</button>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default PartList
