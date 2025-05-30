const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.goto('/')
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Arto Hellas',
        username: 'hellas',
        password: 'iluvborbs'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mlukkai',
        password: 'iluvcats'
      }
    })
  })

  test('Login form is shown', async ({ page }) => {
    await expect (page.getByText('username')).toBeVisible()
    await expect (page.getByText('password')).toBeVisible()
    await expect (page.getByRole('button', { name: 'Log In' })).toBeVisible()
  })

  describe('Login', () => {

    test('Succeeds with correct credentials', async ({ page }) => {

      await loginWith(page, 'hellas', 'iluvborbs')
      await expect(page.getByText('Arto Hellas logged in')).toBeVisible()
    })

    test('Fails with wrong password', async ({ page }) => {

      await loginWith(page, 'hellas', 'salainen')
      await expect(page.getByText('Incorrect username or password.')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'hellas', 'iluvborbs')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright Blog', 'Man McMann', 'https://itsablog.com')
      await expect(page.getByRole('heading', { name: 'Playwright Blog' })).toBeVisible()
    })

    describe('and blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Playwright Blog', 'Man McMann', 'https://itsablog.com')
        await createBlog(page, 'Tests for Days', 'Testy McTest', 'https://testyblog.com')
      })

      test('a new blog can be liked', async ({ page }) => {
        const blogElement = await page.getByRole('heading', { name: 'Playwright Blog' }).locator('..')

        await blogElement.getByRole('button', { name: 'View Details' }).click()
        await blogElement.getByRole('button', { name: 'Like' }).click()

        await expect(blogElement.getByText('Likes: 1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        const blogElement = await page.getByRole('heading', { name: 'Tests for Days' }).locator('..')

        await blogElement.getByRole('button', { name: 'View Details' }).click()
        page.on('dialog', dialog => dialog.accept())
        await blogElement.getByRole('button', { name: 'Delete' }).click()

        await expect(page.getByText('Deleted blog Tests for Days by Testy McTest')).toBeVisible()

      })

      test('delete button is only visible to the right user', async ({ page }) => {
        const blogElement = await page.getByRole('heading', { name: 'Tests for Days' }).locator('..')

        await blogElement.getByRole('button', { name: 'View Details' }).click()

        await expect(blogElement.getByText('Delete')).toBeVisible()

        await page.getByRole('button', { name: 'Log Out' }).click()

        await loginWith(page, 'mlukkai', 'iluvcats')

        await blogElement.getByRole('button', { name: 'View Details' }).click()

        await expect(blogElement.getByText('Delete')).not.toBeVisible()
      })

      test('blogs are correctly ordered by likes', async ({ page }) => {
        const blogElement = await page.getByRole('heading', { name: 'Tests for Days' }).locator('..')

        const otherBlogElement = await page.getByRole('heading', { name: 'Playwright Blog' }).locator('..')

        await blogElement.getByRole('button', { name: 'View Details' }).click()
        await blogElement.getByRole('button', { name: 'Like' }).click()
        await expect(blogElement.getByText('Likes: 1')).toBeVisible()

        await otherBlogElement.getByRole('button', { name: 'View Details' }).click()
        await otherBlogElement.getByRole('button', { name: 'Like' }).click()
        await expect(otherBlogElement.getByText('Likes: 1')).toBeVisible()

        await blogElement.getByRole('button', { name: 'Like' }).click()
        await expect(blogElement.getByText('Likes: 2')).toBeVisible()

        await expect(page.getByTestId('blog').nth(0)).toContainText('Tests for Days')

        await expect(page.getByTestId('blog').nth(1)).toContainText('Playwright Blog')
      })
    })
  })
})