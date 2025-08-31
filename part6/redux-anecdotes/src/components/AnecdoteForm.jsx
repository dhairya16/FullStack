import { useDispatch } from 'react-redux'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.title.value
    event.target.title.value = ''
    dispatch({ type: 'anecdotes/createAnecdote', payload: content })
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
