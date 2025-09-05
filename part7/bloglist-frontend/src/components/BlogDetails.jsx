import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateBlog } from '../reducers/blogReducer'
import { useState } from 'react'
import { addComment } from '../reducers/blogReducer'

const BlogDetails = () => {
  const [comment, setComment] = useState('')

  const id = useParams().id
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((b) => b.id === id)

  const dispatch = useDispatch()

  if (!blog) {
    return null
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }

    dispatch(updateBlog(updatedBlog))
  }

  const handleOnChange = (e) => {
    setComment(e.target.value)
  }

  const handleAddComment = () => {
    dispatch(addComment(id, { comment }))
    setComment('')
  }

  return (
    <>
      <h2>{blog.title}</h2>
      <p>{blog.url}</p>
      <p>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </p>
      <p>added by {blog.author}</p>

      <h2>comments</h2>
      <input type="text" value={comment} onChange={handleOnChange} />
      <button onClick={handleAddComment}>add comment</button>
      <div>
        <ul>
          {blog.comments.map((c) => (
            <li>{c}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default BlogDetails
