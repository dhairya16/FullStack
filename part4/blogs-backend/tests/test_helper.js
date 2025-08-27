const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'xyz',
    url: 'http://google.com',
    likes: 10,
  },
  {
    title: 'Second blog',
    author: 'abc',
    url: 'http://facebook.com',
    likes: 5,
  },
]

const getInitialUsers = async () => {
  return [
    {
      username: 'test1',
      name: 'test1',
      passwordHash: await bcrypt.hash('secret', 10),
    },
    {
      username: 'test2',
      name: 'test2',
      passwordHash: await bcrypt.hash('secret', 10),
    },
  ]
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  getInitialUsers,
}
