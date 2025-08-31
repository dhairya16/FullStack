import { useDispatch } from 'react-redux'
import anecdotesService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const content = event.target.title.value
    event.target.title.value = ''

    const newAnecdote = await anecdotesService.createNew(content)

    dispatch({ type: 'anecdotes/createAnecdote', payload: newAnecdote })
    dispatch({
      type: 'notification/setNotification',
      payload: `new anecdoted ${content} created`,
    })
    setTimeout(() => {
      dispatch({
        type: 'notification/resetNotification',
      })
    }, 5000)
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
