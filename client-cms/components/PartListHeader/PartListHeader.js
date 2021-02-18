import style from '../../styles/PartListHeader.module.scss'

const PartListHeader = (props) => {
  return (
    <>
      <div className={style.partListHeaders}>
        <p className={style.partItemCount}>
          Item: <strong>12</strong> out of <strong>1212</strong>
        </p>
        <div className={style.select}>
          <label>filter:</label>
          <select>
            <option>Part Type</option>
            <option>Processor</option>
            <option>Casing</option>
            <option>Memory</option>
            <option>Video Card</option>
          </select>
          <div className={style.select__arrow}></div>
        </div>
      </div>
    </>
  )
}

export default PartListHeader
