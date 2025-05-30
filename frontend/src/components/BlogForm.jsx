import { useState } from 'react'

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
            placeholder='Blog title'
            data-testid='title'
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          Blog Author:
            <input 
              type="text"
              value={author}
              name="Author"
              placeholder='Blog author'
              data-testid='author'
              onChange={event => setAuthor(event.target.value)}
            />
        </div>
        <div>
          Blog URL:
            <input 
              type="text"
              value={url}
              name="URL"
              placeholder='Blog URL'
              data-testid='url'
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