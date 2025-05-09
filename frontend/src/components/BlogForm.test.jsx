import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('BlogForm calls the event handler with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('Blog title')
  const author = screen.getByPlaceholderText('Blog author')
  const url = screen.getByPlaceholderText('Blog URL')

  const addButton = screen.getByText('Add Blog')

  await user.type(title, 'This is a title')
  await user.type(author, 'Name McName')
  await user.type(url, 'https://test.com')
  await user.click(addButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('This is a title')
  expect(createBlog.mock.calls[0][0].author).toBe('Name McName')
  expect(createBlog.mock.calls[0][0].url).toBe('https://test.com')
})