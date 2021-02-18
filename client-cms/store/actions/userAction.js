import * as authTypes from '../types/auth-types'
// import { buildClient } from '../../api/build-client'
import axios from 'axios'

export const setUser = (currentUser) => async (dispatch) => {
  dispatch({ type: authTypes.SET_USER, payload: currentUser })
}

export const signinUser = ({ user, onSuccess, onError }) => async (
  dispatch,
  getState
) => {
  // const client = await buildClient(null)

  const { username, password } = user

  const errors = []

  if (username === '' || username === null) {
    errors.push({ message: 'Username are missing' })
  }

  if (password === '' || password === null) {
    errors.push({ message: 'Password are missing' })
  }

  if (errors.length > 0) {
    return onError(errors)
  }

  try {
    const res = await axios.post('/api/users/signin', {
      username,
      password,
    })

    await dispatch({
      type: authTypes.SET_USER,
      payload: res.data,
    })

    onSuccess && onSuccess(res.data)
  } catch (err) {
    console.log(err)
    const errorList = err.response.data.errors

    if (onError) {
      onError(errorList)
    }
  }
}

export const signoutUser = ({ onSuccess }) => async (dispatch) => {
  // const client = await buildClient(null)
  await axios.post('/api/users/signout', {})

  await dispatch({
    type: authTypes.SET_USER,
    payload: null,
  })

  onSuccess && onSuccess()
}
