import { connect } from 'react-redux'
import { setUser } from '../store/actions/userAction'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import MainSideBar from '../components/MainSidebar/MainSideBar'
import PartList from '../components/PartList/PartList'
import PartListHeader from '../components/PartListHeader/PartListHeader'
import style from '../styles/Home.module.scss'
import axios from 'axios'
import { buildClient } from '../api/build-client'

const Home = (props) => {
  const router = useRouter()
  const { currentUser, itemTypes } = props

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
                <PartListHeader itemTypes={itemTypes} />
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

Home.getInitialProps = async (appContext) => {
  // console.log(appContext)
  const client = await buildClient(appContext)
  const res = await client.get('/api/parts/itemtype')

  return {
    itemTypes: res.data,
  }
}

export default connect(null, { setUser })(Home)
