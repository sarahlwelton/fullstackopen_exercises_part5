const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')
const user = require('../models/user')
const api = supertest(app)

/* const dummy = (blogs) => {
  return 1
} */

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes)

  return blogs.length === 0
    ? []
    : sortedBlogs[sortedBlogs.length - 1]
}

const countAuthors = (blogs) => {

  const authors = blogs.map((blog) => blog.author)

  const createCount = (authors) => {

    let authorCount = {}

    authors.forEach(author => {

      if (authorCount[author] === undefined ) {
        authorCount[author] = 1
      } else {
        authorCount[author] = authorCount[author] + 1
      }
    })
    return authorCount
  }

  return createCount(authors)
}

const mostBlogs = (blogs) => {

  const countedAuthors = countAuthors(blogs)

  let highestCount = 0

  let maxAuthor = ''

  Object.entries(countedAuthors).forEach(([ author, count ]) => {
    if (count > highestCount) {
      highestCount = count
      maxAuthor = author
    }
  })
  return highestCount === 0
    ? undefined
    :{ 'author': maxAuthor, 'blogs': highestCount }
}

const countLikes = (blogs) => {

  return blogs.reduce((result, blog) => {

    const { author, likes } = blog

    result[author] = (result[author] || 0) + likes

    return result
  }, {})
}

const mostLikes = (blogs) => {

  const countedLikes = countLikes(blogs)

  let highestLikes = 0

  let maxAuthor = ''

  Object.entries(countedLikes).forEach(([ author, likes ]) => {
    if (likes > highestLikes) {
      highestLikes = likes
      maxAuthor = author
    }
  })
  return highestLikes === 0
    ? undefined
    :{ 'author': maxAuthor, 'likes': highestLikes }
}

const initialBlogs = async () => {
  const response = await api.get('/api/blogs')

  return response.body
}

const blogsInDb = async () => {
  const blogs = await blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const blogsList = [{
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0,
  user: '67aa78807bb5004e9518f609'
},
{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0,
  user: '67aa7993785bbb0c4df77c0a'
},
{
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0,
  user: '67aa78807bb5004e9518f609'
},
{
  _id: '5a422b891b54a676234d17fa',
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
  __v: 0,
  user: '67aa7993785bbb0c4df77c0a'
},
{
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
  __v: 0,
  user: '67aa78807bb5004e9518f609'
},
{
  _id: '5a422bc61b54a676234d17fc',
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  __v: 0,
  user: '67aa7993785bbb0c4df77c0a'
}
]

const usersInDb = async () => {
  const users = await user.find({})
  return users.map(user => user.toJSON())
}

const usersList = [{
  username: 'hellas',
  name: 'Arto Hellas',
  passwordHash: '$2a$10$.uEUEIBl90.iMIhjA9VZ/OMswz.ijZp3cgXT.oiBi.uFo54Ava6MK',
  _id: '67aa78807bb5004e9518f609',
  blogs: [
    '5a422a851b54a676234d17f7',
    '5a422b3a1b54a676234d17f9',
    '5a422ba71b54a676234d17fb'
  ]
},
{
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  passwordHash: '$2a$10$Tga8It3xPsKXCR0r52sU6evWODdle.pMGJeqtbS3rGjAFy.IAxGd.',
  _id: '67aa7993785bbb0c4df77c0a',
  blogs: [
    '5a422aa71b54a676234d17f8',
    '5a422b891b54a676234d17fa',
    '5a422bc61b54a676234d17fc'
  ]
}
]

module.exports = {
  //dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  countAuthors,
  countLikes,
  mostLikes,
  initialBlogs,
  blogsList,
  blogsInDb,
  usersList,
  usersInDb
}