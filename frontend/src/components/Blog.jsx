import { useState } from 'react'

const Blog = ({ blog }) => {

  const [visible, setVisible] = useState(false)

  const hidden = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
  return (
    <div>
    <div style={blogStyle}>
      <p><strong>{blog.title}</strong> <button onClick={toggleVisibility}>{visible ? 'Hide': 'View Details'}</button>
      </p>
      <div style={hidden}>
        <p>by {blog.author}</p>
        <p>Likes: {blog.likes} <button>Like</button></p>
        <p>{blog.url}</p>
      </div>
    </div>
    </div>
  )
}

export default Blog