import React from 'react'
import { Provider } from 'react-redux'
import { createWrapper } from 'next-redux-wrapper'
import { buildClient } from '../api/build-client'
import store from '../store/store'
import MainNavbar from '../components/MainNavbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.scss'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Provider store={store}>
      <MainNavbar currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps}>
        {' '}
      </Component>
      <ToastContainer
        className="toast"
        toastClassName="toast-body"
        progressClassName="toast-progbar "
      />
    </Provider>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = await buildClient(appContext.ctx)

  const { data } = await client.get('/api/users/currentuser')

  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    )
  }

  return {
    pageProps,
    ...data,
  }
}

const makestore = () => store
const wrapper = createWrapper(makestore)

export default wrapper.withRedux(AppComponent)
