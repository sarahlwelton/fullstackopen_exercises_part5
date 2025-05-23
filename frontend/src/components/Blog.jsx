import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ 
  blog, 
  updateLikes, 
  deleteBlog,
  user 
}) => {

  const [visible, setVisible] = useState(false)

  const hidden = { 
    display: visible ? '' : 'none', 
    paddingTop: 5,
    borderBottom: '1px solid black',
    width: '300px'
  }

  const userCheck = { 
    display: blog.user.name === user.name ? '' : 'none',
    paddingBottom: 15
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
  return (
    <div>
    <div style={blogStyle}>
      <h3>{blog.title}</h3>
      <p>by {blog.author}</p> 
      <button onClick={toggleVisibility}>{visible ? 'Hide Details': 'View Details'}</button>
      <div style={hidden}
      className="blogDetails">
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

Blog.propTypes = {
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired 
}

export default Blog