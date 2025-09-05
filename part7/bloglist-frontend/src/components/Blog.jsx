import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => setVisible(!visible)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }

    updateBlog(updatedBlog)
  }

  const handleDelete = () => {
    if (!window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      return
    }
    deleteBlog(blog.id)
  }

  console.log(JSON.stringify(blog) + '--' + user.username)

  const showWhenUserMatchesWithBlog = {
    display: blog.user.username === user.username ? '' : 'none',
  }

  return (
    <div style={blogStyle}>
      <div>
        <span className="blog-title-author">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </span>{' '}
        {/* <button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button> */}
      </div>
      <div style={showWhenVisible}>
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <button style={showWhenUserMatchesWithBlog} onClick={handleDelete}>
          remove
        </button>
      </div>
    </div>
  )
}

export default Blog
