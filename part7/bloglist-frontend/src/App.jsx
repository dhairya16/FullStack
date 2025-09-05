import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import BlogDetails from './components/BlogDetails'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import {
  createBlog,
  initialiseBlogs,
  updateBlog,
  deleteBlog,
} from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { Routes, Route, Link } from 'react-router-dom'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)
  const notification = useSelector((state) => state.notification)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialiseBlogs())
  }, [])

  useEffect(() => {
    const loggedUserInfo = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserInfo) {
      const user = JSON.parse(loggedUserInfo)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      dispatch(setNotification(String(error.response.data.error)))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(setUser(null))
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      dispatch(createBlog(newBlog))
    } catch (error) {
      dispatch(setNotification(String(error.response.data.error)))
    }
  }

  const handleLikeBlog = async (blogData) => {
    dispatch(updateBlog(blogData))
  }

  const handleDeleteBlog = async (id) => {
    dispatch(deleteBlog(id))
  }

  const padding = {
    padding: 5,
  }

  const LoggedInElements = () => {
    return (
      <>
        <Togglable btnLabel="create new blog">
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable>

        {blogs.length
          ? blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={handleLikeBlog}
                user={user}
                deleteBlog={handleDeleteBlog}
              />
            ))
          : null}
      </>
    )
  }

  if (user === null) {
    return (
      <div>
        {notification && <div>{notification}</div>}
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">submit</button>
        </form>
      </div>
    )
  }

  return (
    <div className="container">
      {notification && <div>{notification}</div>}

      <div>
        <Link style={padding} to="/">
          blogs
        </Link>

        <Link style={padding} to="/users">
          users
        </Link>

        {user ? (
          <>
            <em style={padding}>{user.name} logged in</em>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>

      <h2>blogs</h2>
      {/* <p>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </p> */}
      <Routes>
        <Route path="/" element={<LoggedInElements />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
      </Routes>
    </div>
  )
}

export default App
