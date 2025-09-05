import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../reducers/usersReducer'
import { Link } from 'react-router-dom'

const Users = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  const users = useSelector((state) => state.users)
  if (users.length === 0) {
    return (
      <>
        <div>no users found</div>
      </>
    )
  }

  return (
    <>
      <h2>Users</h2>
      <table>
        <th></th>
        <th>blogs created</th>
        {users.map((u) => (
          <tr key={u.id}>
            <td>
              <Link to={`/users/${u.id}`}>{u.name}</Link>
            </td>
            <td>{u.blogs.length}</td>
          </tr>
        ))}
      </table>
    </>
  )
}

export default Users
