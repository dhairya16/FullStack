import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    set(state, action) {
      return action.payload
    },
    clear() {
      return null
    },
  },
})

export const setNotification = (content, seconds = 5) => {
  return async (dispatch) => {
    dispatch(set(content))
    setTimeout(() => {
      dispatch(clear())
    }, seconds * 1000)
  }
}

export const { set, clear } = slice.actions
export default slice.reducer
