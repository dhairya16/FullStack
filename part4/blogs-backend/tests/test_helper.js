const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
