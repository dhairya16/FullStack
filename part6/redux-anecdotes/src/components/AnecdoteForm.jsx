import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.title.value
    dispatch(createAnecdote(content))
    event.target.title.value = ''
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
