import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import Togglable from './Toggleable'
import { expect } from 'vitest'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'http://example.com',
  likes: 5,
  user: {
    name: 'michaelr'
  }
}

test('clicking the like button twice calls event handler twice', async () => {
  const mockIncrementLikes = vi.fn()
  render(<Blog blog={blog} incrementLikes={mockIncrementLikes} />)

  screen.debug()
  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockIncrementLikes).toHaveBeenCalledTimes(2)
})

describe('renders title and author, but not url or likes by default', () => {
  beforeEach(() => {
    render(
      <div>
        {blog.title} , {blog.author}
        <Togglable buttonShowLabel="view" buttonHideLabel="hide">
          <div>{blog.url}</div>
          <div>likes: {blog.likes}</div>
        </Togglable>
      </div>
    )
  })

  test('renders title and author', () => {
    screen.getByText('Component testing is done with react-testing-library , Test Author')
  })

  test('does not render url and likes', () => {
    screen.debug()
    const url = screen.queryByText('http://example.com')
    expect(url).not.toBeVisible()

    const likes = screen.queryByText('likes: 5')
    expect(likes).not.toBeVisible()
  })

  test('renders url and likes when view button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('http://example.com')
    const likes = screen.getByText('likes: 5')

    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })

  // render(<Blog blog={blog} />)

  // const title = screen.getByText('Component testing is done with react-testing-library')
  // expect(title).toBeDefined()

  // const author = screen.getByText('Test Author')
  // expect(author).toBeDefined()

  // const url = screen.queryByText('http://example.com')
  // expect(url).toBeNull()

  // const likes = screen.queryByText('likes:')
  // expect(likes).toBeNull()
})