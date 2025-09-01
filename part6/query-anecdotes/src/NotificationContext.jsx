import { useReducer, createContext, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'RESET':
      return ''
    default:
      return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatcher] = useReducer(
    notificationReducer,
    ''
  )

  return (
    <NotificationContext.Provider
      value={[notification, notificationDispatcher]}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationDispatcher = () => {
  const notificationReducer = useContext(NotificationContext)
  return notificationReducer[1]
}

export default NotificationContext
