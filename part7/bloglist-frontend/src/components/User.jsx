import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
  const id = useParams().id
  const users = useSelector((state) => state.users)
  const user = users.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.length ? (
          user.blogs.map((b) => <li key={b.id}>{b.title}</li>)
        ) : (
          <p>no blogs</p>
        )}
      </ul>
    </>
  )
}

export default User
