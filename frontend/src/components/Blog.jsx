const Blog = ({ blog }) => (
  <div>
    <p><strong>{blog.title}</strong></p> 
    <p>by {blog.author}</p>
  </div>  
)

export default Blog