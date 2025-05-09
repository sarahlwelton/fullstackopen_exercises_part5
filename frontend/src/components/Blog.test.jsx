import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

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

  beforeEach(() => {
    container = render(
      <Blog blog={blog} 
      user={user} 
      />
    ).container
  })
  
  test('Blog renders title and author but not URL or likes', () => {
    const div = container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display: none')
  })
  
  test('Blog renders URL and likes on click', async () => {
    const actor = userEvent.setup()
    const button = screen.getByText('View Details')
    await actor.click(button)
  
    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })
})

