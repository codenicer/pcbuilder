
import {connect } from 'react-redux';
import style from  '../styles/MainFooter.module.scss'

const MainFooter = (props) => {
  
  return (
   <>
    <footer className={style.mainFooter} >
      <nav >
        <ul className={style.footerNavLinks}>
          <li className={style.footerNavLink}>About Us</li>
          <li className={style.footerNavLink}>Privacy Policy</li>
          <li className={style.footerNavLink}>Cokies</li>
        </ul>
      </nav>
    </footer>
   </>
  )
}

const transferStatetoProps = state => ({
})

export default connect(transferStatetoProps,{})(MainFooter) 