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

  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} 
      user={user}
      updateLikes={mockHandler} 
      />
    ).container
  })

  test('Blog initially shows title and author but not URL or likes', () => {
    const div = container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display: none')
  })
  
  test('Blog shows URL and likes on click', async () => {
    const actor = userEvent.setup()
    const button = screen.getByText('View Details')
    await actor.click(button)
  
    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('Clicking Like twice calls event handler twice', async () => {
    const actor = userEvent.setup()
    const button = screen.getByText('Like')
    await actor.click(button)
    await actor.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

