import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByLabelText('title')
  const sendButton = screen.getByText('save')

  await user.type(inputTitle, 'Testing a form...')
  await user.click(sendButton)

  console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing a form...')
})