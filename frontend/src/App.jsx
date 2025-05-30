import { useState, useEffect,  useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/Login'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes)
    ))
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogsUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Logging in', username)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedInBlogsUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setMessage(`Welcome, ${user.name}!`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Invalid credentials.')
      setMessage('Incorrect username or password.')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInBlogsUser')
    setUser(null)
    setMessage('Logged out')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addBlog = (blogObject) => {

    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`A new blog, ${returnedBlog.title} by ${returnedBlog.author}, was added.`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const updateLikes = id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog))
      })
      .catch(error => {
        setMessage(
          `Could not update likes for ${blog.title}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== id))
      })
  }

  const deleteBlog = id => {
    const blog = blogs.find(b => b.id === id)

    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      blogService
      .deleteBlog(blog.id)
      .then(setMessage(`Deleted blog ${blog.title} by ${blog.author}.`),
      setTimeout(() => {
        setMessage(null)
      }, 5000))
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel='Add Blog' ref={blogFormRef} >
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <h1>Blogs List</h1>
        <Notification
          message={message}
        />
      {user === null ?
      <div>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          /> 
      </div> :
        <div>
          <p><strong>{user.name}</strong> logged in</p>
          <button
            type="submit"
            onClick={() => handleLogout() }>Log Out</button>
          {blogForm()}
        <h2>Current Saved Blogs</h2>
        <div id="blogsList">
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateLikes={updateLikes}
            deleteBlog={deleteBlog} user={user} />
          )}
        </div>
    </div>
    }
    
  </div>
  )
}

export default App