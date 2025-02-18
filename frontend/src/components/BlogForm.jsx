const BlogForm = ({ addBlog, title, handleTitleChange, author, handleAuthorChange, url,  handleUrlChange }) => (
  <>
    <h2>Add a New Blog</h2>
    <form onSubmit={addBlog}>
      <div>
        Blog Title:
        <input 
          type="text"
          value={title}
          name="Title"
          onChange={handleTitleChange}
        />
      </div>
      <div>
        Blog Author:
          <input 
            type="text"
            value={author}
            name="Author"
            onChange={handleAuthorChange}
          />
      </div>
      <div>
        Blog URL:
          <input 
            type="text"
            value={url}
            name="URL"
            onChange={handleUrlChange}
          />
      </div>
      <div>
        <button type="submit">Add Blog</button>
      </div>
    </form>
  </>
)

export default BlogForm