import Router from 'next/router'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { signoutUser } from '../../store/actions/userAction'

const Signout = ({ signoutUser }) => {
  useEffect(() => {
    signoutUser({
      onSuccess: () => {
        Router.push('/signin')
      },
    })
  }, [])

  return (
    <div>
      <h1>Signing you out...</h1>
    </div>
  )
}

export default connect(null, { signoutUser })(Signout)
