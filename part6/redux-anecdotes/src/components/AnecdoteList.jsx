import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(({ anecdotes, filter }) =>
    [...anecdotes]
      .filter((a) => a.content.toLowerCase().includes(filter))
      .sort((a, b) => b.votes - a.votes)
  )

  const handleVote = (anecdote) => {
    dispatch({ type: 'anecdotes/addVote', payload: anecdote.id })
    dispatch({
      type: 'notification/setNotification',
      payload: `you voted '${anecdote.content}'`,
    })
    setTimeout(() => {
      dispatch({
        type: 'notification/resetNotification',
      })
    }, 5000)
  }

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
