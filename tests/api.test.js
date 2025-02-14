const { test, after, beforeEach, describe } = require('node:test')
const helper = require('../utils/list_helper')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.blogsList) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
  await User.deleteMany({})
  for (let user of helper.usersList) {
    let userObject = new User(user)
    await userObject.save()
  }
})

test('the list of all blogs is returned correctly', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 6)
})

test('the unique ID property for each blog is named "id"', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.match(blog.id, /^[0-9a-f]{24}$/i)
  })

})
describe('adding blogs', () => {

  test('a valid blog can be added with status code 201', async () => {
    const newBlog = {
      title: 'Adventures in React',
      author: 'Mary Poppins',
      url: 'https://test.test.com/',
      likes: 0
    }

    const user = {
      username: 'hellas',
      password: 'iluvdogs'
    }

    const initialBlogsResult = await helper.initialBlogs()

    const token = (await api.post('/api/login').send(user)).body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')

    assert.strictEqual(blogsAtEnd.body.length, initialBlogsResult.length + 1)

    const blogContents = blogsAtEnd.body.map(blog => blog.title)
    assert(blogContents.includes('Adventures in React'))
  })

  test('if likes property is missing from request, default to 0', async () => {
    const newBlog = {
      title: 'React is Fun',
      author: 'Steve McMann',
      url: 'https://reactisfun.com'
    }

    const user = {
      username: 'hellas',
      password: 'iluvdogs'
    }

    const token = (await api.post('/api/login').send(user)).body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlogList = await api.get('/api/blogs')

    assert.strictEqual(newBlogList.body[6].likes, 0)
  })

  test('if no token is provided in request, fail with status 401', async () => {

    const newBlog = {
      title: 'This Test Will Fail',
      author: 'Faily Man',
      url: 'https://this.test.will.fail.com'
    }

    const initialBlogsResult = await helper.initialBlogs()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await api.get('/api/blogs')

    assert.strictEqual(initialBlogsResult.length, blogsAtEnd.body.length)
  })

})

describe('400 error checks', () => {

  test('if title property is missing, respond with 400', async () => {
    const newBlog = {
      author: 'Broken Man',
      url: 'https://brokenlink.com',
      likes: 5
    }

    const user = {
      username: 'hellas',
      password: 'iluvdogs'
    }

    const token = (await api.post('/api/login').send(user)).body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('if url property is missing, respond with 400', async () => {
    const newBlog = {
      author: 'Broken Man',
      title: 'What a Broken Link',
      likes: 5
    }

    const user = {
      username: 'hellas',
      password: 'iluvdogs'
    }

    const token = (await api.post('/api/login').send(user)).body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

})

describe('deleting a blog', () => {

  test('succeeds with status code 204 if the id value and user is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const user = {
      username: 'hellas',
      password: 'iluvdogs'
    }

    const token = (await api.post('/api/login').send(user)).body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.blogsList.length - 1)

    const titles = blogsAtEnd.map(t => t.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('fails with status code 400 if the id value is invalid', async () => {
    const user = {
      username: 'hellas',
      password: 'iluvdogs'
    }

    const token = (await api.post('/api/login').send(user)).body.token

    await api
      .delete('/api/blogs/1234')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

  test('fails with status code 403 if the requesting user did not create the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[1]

    const user = {
      username: 'hellas',
      password: 'iluvdogs'
    }

    const token = (await api.post('/api/login').send(user)).body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.blogsList.length)
  })
})

describe('updating a blog', () => {

  test('succeeds with status code 200 if the id value is valid, and updates likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      likes: 25
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd[0].likes, 25)
  })

  test('fails with status code 400 if the id value is invalid', async () => {
    await api
      .put('/api/blogs/1234')
      .expect(400)
  })
})

describe('adding users', () => {
  test('succeeds with status code 201 if username = unique + username.length/password.length > 3', async () => {
    const user = {
      'username': 'long',
      'name': 'Long Enough',
      'password': 'longPassword'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)

    const newUsersList = await helper.usersInDb()

    assert.strictEqual(newUsersList[2].name, 'Long Enough')
  })

  test('fails with status code 400 if username < 3 characters', async () => {

    const usersAtStart = await helper.usersInDb()

    const shortUser = {
      'username': 'st',
      'name': 'Short Name',
      'password': 'short'
    }

    const result = await api
      .post('/api/users')
      .send(shortUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Usernames and passwords must be at least 3 characters.'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status code 400 if password < 3 characters', async () => {

    const usersAtStart = await helper.usersInDb()

    const shortUser = {
      'username': 'short',
      'name': 'Short Password',
      'password': 'st'
    }

    const result = await api
      .post('/api/users')
      .send(shortUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Usernames and passwords must be at least 3 characters.'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status code 400 if username is not unique', async () => {

    const usersAtStart = await helper.usersInDb()

    const repeatUser = {
      'username': 'hellas',
      'name': 'Arto Hellas',
      'password': 'repeat'
    }

    const result = await api
      .post('/api/users')
      .send(repeatUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Usernames must be unique. Enter another username.'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})