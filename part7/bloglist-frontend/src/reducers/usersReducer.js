import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/user'

const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const fetchUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export const { setUsers, clearUser } = slice.actions
export default slice.reducer
