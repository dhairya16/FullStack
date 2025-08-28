import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((b1, b2) => b2.likes - b1.likes)))
  }, [])

  useEffect(() => {
    const loggedUserInfo = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserInfo) {
      const user = JSON.parse(loggedUserInfo)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setNotification(String(error.response.data.error))
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))

      setNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setNotification(String(error.response.data.error))
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLikeBlog = async (blogData) => {
    const updatedBlog = await blogService.update(blogData)
    setBlogs(
      blogs
        .map((b) => (b.id !== updatedBlog.id ? b : updatedBlog))
        .sort((b1, b2) => b2.likes - b1.likes)
    )
  }

  const handleDeleteBlog = async (id) => {
    await blogService.deleteBlog(id)
    setBlogs(blogs.filter((b) => b.id !== id))
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
    <div>
      {notification && <div>{notification}</div>}
      <h2>blogs</h2>
      <p>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable btnLabel="create new blog">
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={handleLikeBlog}
          user={user}
          deleteBlog={handleDeleteBlog}
        />
      ))}
    </div>
  )
}

export default App
