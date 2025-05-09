import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('Blog renders title and author but not URL or likes', () => {
  const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    user : {
      name: 'Arto Hellas'
    }
  }

  const user = {
    name: 'Arto Hellas'
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  screen.debug()

  const div = container.querySelector('.blogDetails')
  expect(div).not.toBeVisible()
})