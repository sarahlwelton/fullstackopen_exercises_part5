import { useState } from 'react'

const Blog = ({ 
  blog, 
  updateLikes, 
  deleteBlog,
  user 
}) => {

  const [visible, setVisible] = useState(false)

  const hidden = { display: visible ? '' : 'none' }

  const userCheck = { display: blog.user.name === user.name ? '' : 'none'}

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
      <p><strong>{blog.title}</strong>  
      <button onClick={toggleVisibility}>{visible ? 'Hide': 'View Details'}</button>
      </p>
      <div style={hidden}>
        <p>by {blog.author}</p>
        <p>Likes: {blog.likes} <button onClick={() => updateLikes(blog.id)}>Like</button></p>
        <p>{blog.url}</p>
        <p>Added by: {blog.user.name}</p>
        <div style={userCheck}>
          <button onClick={() => deleteBlog(blog.id)}>Delete</button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Blog