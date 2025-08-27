const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany()
  const users = await helper.getInitialUsers()
  await User.insertMany(users)
})

test('blogs are returned as json', async () => {
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

describe.only('While adding a new blog', () => {
  test('a valid blog with valid token can be added', async () => {
    const resp = await api.post('/api/login').send({
      username: 'test1',
      password: 'secret',
    })

    const newBlog = {
      title: 'new blog',
      author: 'def',
      url: 'http://google.com',
      likes: 9,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${resp.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const contents = blogsAtEnd.map((b) => b.title)

    assert(contents.includes('new blog'))
  })

  test('a valid blog with invalid token gives 401', async () => {
    const resp = await api.post('/api/login').send({
      username: 'test3',
      password: 'secret',
    })

    const newBlog = {
      title: 'new blog',
      author: 'def',
      url: 'http://google.com',
      likes: 9,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${resp.body.token}`)
      .send(newBlog)
      .expect(401)
  })
})

test('a blog having a default likes value', async () => {
  const resp = await api.post('/api/login').send({
    username: 'test1',
    password: 'secret',
  })

  const newBlog = {
    title: 'new blog',
    author: 'def',
    url: 'http://google.com',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${resp.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('if title or url is not present in blog then return status 400', async () => {
  const resp = await api.post('/api/login').send({
    username: 'test1',
    password: 'secret',
  })

  const newBlog = {
    author: 'def',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${resp.body.token}`)
    .send(newBlog)

  assert.strictEqual(response.status, 400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const loginResp = await api.post('/api/login').send({
      username: 'test1',
      password: 'secret',
    })
    const token = loginResp.body.token

    // Create a blog with the token
    const newBlog = {
      title: 'blog to delete',
      author: 'test',
      url: 'http://example.com',
      likes: 1,
    }
    const createResp = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogId = createResp.body.id

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map((b) => b.title)
    assert(!titles.includes(newBlog.title))
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

describe('while creating a user', () => {
  test('a valid user is successfully getting created', async () => {
    const newUser = {
      username: 'admin',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map((u) => u.username)

    assert(usernames.includes('admin'))
  })

  test('an invalid user not created and returns appropriate status code', async () => {
    const newUser = {
      username: 'ad',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map((u) => u.username)

    assert(!usernames.includes('ad'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
