import style from '../../styles/PartListHeader.module.scss'

const PartListHeader = ({ itemTypes }) => {
  return (
    <>
      <div className={style.partListHeaders}>
        <p className={style.partItemCount}>
          Item: <strong>12</strong> out of <strong>1212</strong>
        </p>
        <div className={style.select}>
          <label>filter:</label>
          <select>
            {[{ name: 'Part Type', id: null }, ...itemTypes].map((type, i) => {
              return (
                <option key={i} value={type.id}>
                  {type.name}
                </option>
              )
            })}
          </select>
          <div className={style.select__arrow}></div>
        </div>
      </div>
    </>
  )
}

export default PartListHeader
