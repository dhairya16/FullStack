import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'
import { setNotification } from './notificationReducer'

const slice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      return [...state, action.payload]
    },
    addUpdatedBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
    },
    removeBlog(state, action) {
      return state.filter((b) => b.id !== action.payload)
    },
  },
})

export const initialiseBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (data) => {
  return async (dispatch) => {
    const blog = await blogsService.create(data)
    dispatch(appendBlog(blog))
    dispatch(
      setNotification(`a new blog ${blog.title} by ${blog.author} added`)
    )
  }
}

export const updateBlog = (data) => {
  return async (dispatch) => {
    const updatedBlog = await blogsService.update(data)
    dispatch(addUpdatedBlog(updatedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogsService.deleteBlog(id)
    dispatch(removeBlog(id))
  }
}

export const addComment = (id, data) => {
  return async (dispatch) => {
    const updatedBlog = await blogsService.addComment(id, data)
    dispatch(addUpdatedBlog(updatedBlog))
  }
}

export const { setBlogs, appendBlog, addUpdatedBlog, removeBlog } =
  slice.actions
export default slice.reducer
