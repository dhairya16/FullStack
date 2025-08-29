const express = require('express')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

const blogRouter = express.Router()

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  })
  response.status(201).json(populatedBlog)
})

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user
    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blogToDelete = await Blog.findById(request.params.id)
    if (user._id.toString() !== blogToDelete.user.toString()) {
      return response.status(400).json({ error: 'operation not allowed' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
)

blogRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  await blog.save()
  const updatedBlog = await Blog.findById(blog._id).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(updatedBlog)
})

module.exports = blogRouter
