import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'

import { createTestUser, loginTestUser } from './helpers/api'

const TEST_DOMAIN = 'mise-e2e.test'
const TOKEN_KEY = 'mise_access_token'

test.describe('Registration', () => {
  test('happy path', async ({ page }) => {
    const password = faker.internet.password({ length: 10 })

    await page.goto('/register')
    await page.getByLabel('First Name').fill(faker.person.firstName())
    await page.getByLabel('Last Name').fill(faker.person.lastName())
    await page.getByLabel('Email').fill(`${faker.internet.username()}@${TEST_DOMAIN}`)
    await page.getByLabel('Password', { exact: true }).fill(password)
    await page.getByLabel('Confirm Password').fill(password)
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page).toHaveURL('/')
    expect(await page.evaluate((k) => localStorage.getItem(k), TOKEN_KEY)).not.toBeNull()
  })
})

test.describe('Login', () => {
  let email: string
  let password: string

  test.beforeAll(async () => {
    email = `${faker.internet.username()}@${TEST_DOMAIN}`
    password = faker.internet.password({ length: 10 })
    await createTestUser({
      email,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password,
    })
  })

  test('happy path', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL('/')
    expect(await page.evaluate((k) => localStorage.getItem(k), TOKEN_KEY)).not.toBeNull()
  })
})

test.describe('Logout', () => {
  let email: string
  let password: string

  test.beforeAll(async () => {
    email = `${faker.internet.username()}@${TEST_DOMAIN}`
    password = faker.internet.password({ length: 10 })
    await createTestUser({
      email,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password,
    })
  })

  test('confirm logout happy path', async ({ page }) => {
    const { accessToken } = await loginTestUser(email, password)
    await page.addInitScript(
      ({ key, token }) => { localStorage.setItem(key, token); },
      { key: TOKEN_KEY, token: accessToken },
    )
    await page.goto('/')

    await page.getByRole('button', { name: 'Account menu' }).click()
    await page.getByRole('menuitem', { name: 'Logout' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page).toHaveURL('/login')
    expect(await page.evaluate((k) => localStorage.getItem(k), TOKEN_KEY)).toBeNull()
  })
})

test.describe('Guest route', () => {
  test('redirects logged-in user away from /login', async ({ page }) => {
    await page.addInitScript((key) => { localStorage.setItem(key, 'fake-token'); }, TOKEN_KEY)
    await page.goto('/login')
    await expect(page).toHaveURL('/')
  })
})
