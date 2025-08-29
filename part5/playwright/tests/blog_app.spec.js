const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database
    await request.post('http://localhost:5173/api/testing/reset')
    // Create a user
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'root',
        username: 'root',
        password: 'secret',
      },
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'submit' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('root')
      await page.getByLabel('password').fill('secret')
      await page.getByRole('button', { name: 'submit' }).click()
      await expect(page.getByText('root logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('root')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'submit' }).click()
      await expect(page.getByText(/invalid|wrong/i)).toBeVisible()
      await expect(page.getByText('root logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      // Log in
      await page.getByLabel('username').fill('root')
      await page.getByLabel('password').fill('secret')
      await page.getByRole('button', { name: 'submit' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title:').fill('Playwright Blog')
      await page.getByLabel('author:').fill('Playwright Author')
      await page.getByLabel('url:').fill('http://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page.getByText('Playwright Blog Playwright Author')
      ).toBeVisible()
    })

    describe('a new blog', () => {
      beforeEach(async ({ page, request }) => {
        // Create a blog
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByLabel('title:').fill('Likeable Blog')
        await page.getByLabel('author:').fill('Author')
        await page.getByLabel('url:').fill('http://likeable.blog')
        await page.getByRole('button', { name: 'create' }).click()

        await page.waitForTimeout(1000)
      })

      test('can be liked', async ({ page }) => {
        // Reveal blog details
        const blog = page.getByText('Likeable Blog Author').locator('..') // parent
        await blog.getByRole('button', { name: 'show' }).click()

        // Like the blog
        await page.getByRole('button', { name: 'like' }).click()
        // Check that likes increased to 1
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('the user who created the blog can delete it', async ({ page }) => {
        // Reveal blog details
        const blog = page.getByText('Likeable Blog Author').locator('..')
        await blog.getByRole('button', { name: 'show' }).click()

        // Handle the confirm dialog
        page.once('dialog', async (dialog) => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toMatch(/remove|delete/i) // optional assertion
          await dialog.accept()
        })

        // Click delete button
        await blog.locator('..').getByRole('button', { name: 'remove' }).click()

        // Assert blog is no longer visible
        await expect(page.getByText('Likeable Blog Author')).not.toBeVisible()
      })

      test('only the creator sees the delete button', async ({
        page,
        request,
      }) => {
        // Reveal blog details as creator
        const blog = page.getByText('Likeable Blog Author').locator('..')
        await blog.getByRole('button', { name: 'show' }).click()

        // Creator should see remove
        await expect(
          blog.locator('..').getByRole('button', { name: 'remove' })
        ).toBeVisible()

        // Logout root
        await page.getByRole('button', { name: 'logout' }).click()

        // Create another user via API
        await request.post('http://localhost:5173/api/users', {
          data: {
            name: 'Other User',
            username: 'other',
            password: 'secret',
          },
        })

        // Login as another user
        await page.getByLabel('username').fill('other')
        await page.getByLabel('password').fill('secret')
        await page.getByRole('button', { name: 'submit' }).click()

        // Reveal blog details again
        const blogAsOther = page.getByText('Likeable Blog Author').locator('..')
        await blogAsOther.getByRole('button', { name: 'show' }).click()

        // Other user should NOT see the remove button
        await expect(
          blogAsOther.getByRole('button', { name: 'remove' })
        ).toHaveCount(0)
      })

      test('blogs are ordered according to likes, with most liked first', async ({
        page,
      }) => {
        // Create multiple blogs
        const blogs = [
          { title: 'First Blog', author: 'Author1', url: 'http://first.com' },
          { title: 'Second Blog', author: 'Author2', url: 'http://second.com' },
          { title: 'Third Blog', author: 'Author3', url: 'http://third.com' },
        ]
        await page.getByRole('button', { name: 'create new blog' }).click()
        for (const blog of blogs) {
          await page.getByLabel('title:').fill(blog.title)
          await page.getByLabel('author:').fill(blog.author)
          await page.getByLabel('url:').fill(blog.url)
          await page.getByRole('button', { name: 'create' }).click()
        }

        // Like blogs: Second Blog -> 2 likes, First Blog -> 1 like
        const secondBlog = page.getByText('Second Blog Author2').locator('..')
        await secondBlog.getByRole('button', { name: 'show' }).click()
        await secondBlog.getByRole('button', { name: 'like' }).click()
        await secondBlog.getByRole('button', { name: 'like' }).click()

        const firstBlog = page.getByText('First Blog Author1').locator('..')
        await firstBlog.getByRole('button', { name: 'show' }).click()
        await firstBlog.getByRole('button', { name: 'like' }).click()

        // Get all blog entries after liking
        const blogElements = await page.locator('.blog').allTextContents()

        // Assert order: Second Blog first, then First Blog, then Third Blog
        expect(blogElements[0]).toContain('Second Blog Author2')
        expect(blogElements[1]).toContain('First Blog Author1')
        expect(blogElements[2]).toContain('Third Blog Author3')
      })
    })
  })
})
