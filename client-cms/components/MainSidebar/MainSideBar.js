import style from '../../styles/MainSidebar.module.scss'

const MainSideBar = () => {
  return (
    <div className={style.mainSidebar}>
      <div className={style.mainSideBar_PrimarySelections}>
        <ul className={style.SelectionList}>
          <li className={style.selection}>
            <img
              className={style.sideBarIcon}
              src="/admin/clutch-disc.svg"
              alt="Parts"
            />
            <p>PC Parts</p>
          </li>
          <li className={style.selection}>
            <img
              className={style.sideBarIcon}
              src="/admin/clutch-disc.svg"
              alt="An SVG of an eye"
            />
            <p>PC Parts</p>
          </li>
          <li className={style.selection}>
            <img
              className={style.sideBarIcon}
              src="/admin/clutch-disc.svg"
              alt="An SVG of an eye"
            />
            <p>PC Parts</p>
          </li>
        </ul>
      </div>
      <div className={style.mainSideBar_SecondarySelection}></div>
    </div>
  )
}

export default MainSideBar
