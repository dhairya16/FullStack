const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('notes are returned as json', async () => {
  console.log('entered test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property of the blog posts is named id', async () => {
  const blogs = await helper.blogsInDb()
  const firstBlog = blogs[0]
  assert('id' in firstBlog)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'def',
    url: 'http://google.com',
    likes: 9,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const contents = blogsAtEnd.map((b) => b.title)

  assert(contents.includes('new blog'))
})

test('a blog having a default likes value', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'def',
    url: 'http://google.com',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('if title or url is not present in blog then return status 400', async () => {
  const newBlog = {
    author: 'def',
  }

  const response = await api.post('/api/blogs').send(newBlog)
  assert.strictEqual(response.status, 400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map((b) => b.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('updation of a blog', () => {
  test('succeeds', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: 100,
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const blogAfterUpdate = blogsAtEnd.find(
      (b) => b.title === blogToUpdate.title
    )
    assert.strictEqual(blogAfterUpdate.likes, 100)
  })
})

after(async () => {
  await mongoose.connection.close()
})
