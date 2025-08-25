const express = require('express')
const Blog = require('../models/blog')

const blogRouter = express.Router()

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const newBlog = { ...request.body, likes: request.body.likes || 0 }
  const blog = new Blog(newBlog)
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogRouter
