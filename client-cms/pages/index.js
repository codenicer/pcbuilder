import { connect } from 'react-redux'
import { setUser } from '../store/actions/userAction'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import MainSideBar from '../components/MainSidebar/MainSideBar'
import PartList from '../components/PartList/PartList'
import PartListHeader from '../components/PartListHeader/PartListHeader'
import style from '../styles/Home.module.scss'

const Home = (props) => {
  const router = useRouter()
  const { currentUser } = props

  useEffect(() => {
    if (!currentUser) {
      return router.push('/signin')
    }

    // if (!['admin'].includes(currentUser.role)) {
    //   toaster('Account not authorized', 'error')
    //   // return router.push('/signin')
    // }
    setUser()
  }, [])

  return (
    <>
      <div className="container">
        <main className="mainContent homeContainer">
          {!currentUser ? (
            <></>
          ) : (
            <>
              <MainSideBar />
              <div className={style.partListContainer}>
                <PartListHeader />
                <PartList />
              </div>
            </>
          )}
        </main>
        {/* <MainFooter /> */}
      </div>
    </>
  )
}

export default connect(null, { setUser })(Home)
