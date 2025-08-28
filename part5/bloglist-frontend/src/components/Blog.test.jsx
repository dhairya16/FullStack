import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'sample title',
    author: 'me',
    url: 'http://url.com',
    likes: 10,
    user: { username: 'user', name: 'User' },
  }

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      user={{ username: 'user' }}
      deleteBlog={() => {}}
    />
  )

  // Title and author are visible
  const titleAuthor = screen.getByText(/sample title me/i)
  expect(titleAuthor).toBeInTheDocument()

  // URL and likes are not visible by default
  const url = screen.queryByText(blog.url)
  expect(url).not.toBeVisible()

  const likes = screen.queryByText(/likes 10/i)
  expect(likes).not.toBeVisible()
})

// eslint-disable-next-line quotes
test('shows blog URL and likes after clicking the show button', async () => {
  const blog = {
    title: 'sample title',
    author: 'me',
    url: 'http://url.com',
    likes: 10,
    user: { username: 'user', name: 'User' },
  }

  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      user={{ username: 'user' }}
      deleteBlog={() => {}}
    />
  )

  // Click the show button using userEvent
  const showButton = screen.getByRole('button', { name: /show/i })
  await user.click(showButton)

  // URL and likes should now be visible
  expect(screen.getByText(blog.url)).toBeVisible()
  expect(screen.getByText(/likes 10/i)).toBeVisible()
})

test('calls event handler twice when like button is clicked twice', async () => {
  const blog = {
    title: 'sample title',
    author: 'me',
    url: 'http://url.com',
    likes: 10,
    user: { username: 'user', name: 'User' },
  }

  const mockUpdateBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdateBlog}
      user={{ username: 'user' }}
      deleteBlog={() => {}}
    />
  )

  // Reveal the like button
  const showButton = screen.getByRole('button', { name: /show/i })
  await user.click(showButton)

  const likeButton = screen.getByRole('button', { name: /like/i })
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
})
