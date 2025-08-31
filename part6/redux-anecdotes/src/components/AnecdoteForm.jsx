import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const content = event.target.title.value
    event.target.title.value = ''

    dispatch(createAnecdote(content))
    dispatch(setNotification(`new anecdote '${content}'`, 5))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="title" />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
