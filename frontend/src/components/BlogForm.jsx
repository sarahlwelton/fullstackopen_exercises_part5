import { useState } from 'react'

// Add ref to hide after new blog created
const BlogForm = ({ createBlog }) => {
  
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  
  return (
    <>
      <h2>Add a New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Blog Title:
          <input 
            type="text"
            value={title}
            name="Title"
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          Blog Author:
            <input 
              type="text"
              value={author}
              name="Author"
              onChange={event => setAuthor(event.target.value)}
            />
        </div>
        <div>
          Blog URL:
            <input 
              type="text"
              value={url}
              name="URL"
              onChange={event => setUrl(event.target.value)}
            />
        </div>
        <div>
          <button type="submit">Add Blog</button>
        </div>
      </form>
    </>
    )
}

export default BlogForm