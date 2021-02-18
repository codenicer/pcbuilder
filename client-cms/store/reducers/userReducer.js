import * as authTypes from '../types/auth-types'

const initialState = {
  currentUser: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case authTypes.SET_USER:
    case authTypes.GET_USER:
      return {
        ...state,
        currentUser: action.payload,
      }

    default:
      return state
  }
}

export { userReducer, initialState }
