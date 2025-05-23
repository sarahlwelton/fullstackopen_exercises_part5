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

      await loginWith(page, 'mluukai', 'salainen')
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
  })
})