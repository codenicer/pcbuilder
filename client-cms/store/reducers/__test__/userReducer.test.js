import { userReducer, initialState } from '../userReducer'
import * as authTypes from '../../types/auth-types'

const userPayloadSample = {
  currentUser: {
    id: '602e8c9fe49852001c8f713a',
    email: 'test@test.com',
    iat: 1613663391,
    role: 'user',
    verified: false,
    username: 'codeNicer',
    firstName: 'firstnane',
    middleName: 'middlename',
    lastName: 'middlename',
  },
}

it('Should return initial state', async () => {
  const state = userReducer(initialState, {})
  expect(state.currentUser).toEqual(null)
})

it('Should return set a user on dispatch SET_USER', async () => {
  const state = userReducer(initialState, {
    type: authTypes.SET_USER,
    payload: userPayloadSample.currentUser,
  })

  expect(state.currentUser.id).toBeDefined()
  expect(state.currentUser.email).toBeDefined()
  expect(state.currentUser.iat).toBeDefined()
  expect(state.currentUser.verified).toBeDefined()
  expect(state.currentUser.username).toBeDefined()
  expect(state.currentUser.firstName).toBeDefined()
  expect(state.currentUser.middleName).toBeDefined()
  expect(state.currentUser.lastName).toBeDefined()
})
