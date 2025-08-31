import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    addNotification(state, action) {
      return action.payload
    },
    resetNotification() {
      return ''
    },
  },
})

export const { addNotification, resetNotification } = notificationSlice.actions

export const setNotification = (content, timeout) => {
  return async (dispatch) => {
    dispatch(addNotification(content))

    setTimeout(() => {
      dispatch(resetNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer
