import Head from 'next/head'
import Link from 'next/link'
import style from '../styles/MainNavbar.module.scss'

const MainNavbar = ({ currentUser }) => {
  return (
    <>
      <Head>
        <title>PC BUILDER DEV</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <nav className={style.mainNav}>
        <Link href="/">
          <a className={style.navIcon}>PCBUILDER</a>
        </Link>
        {currentUser ? (
          <>
            <ul className={`${style.navLinks} ${style.navLinks_Login}`}>
              <li>{`Welcome ${currentUser.username}`}</li>
              <li>
                <Link href="/signout"> Logout </Link>
              </li>
            </ul>
          </>
        ) : (
          <ul className={style.navLinks}>
            <li>Home</li>
            <li>Contact Us</li>
          </ul>
        )}
      </nav>
    </>
  )
}

export default MainNavbar
