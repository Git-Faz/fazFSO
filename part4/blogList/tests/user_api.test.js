import { after, beforeEach, describe, test } from 'node:test'
import app from '../app.js'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { usersInDb } from './test_helper.js'
import { User } from '../models/user.js'

const api = supertest(app)

describe('users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('a valid user can be added', async () => {
    const newUser = {
      username: 'newuser69',
      name: 'New User',
      password: 'password123'
    }

    const usersAtStart = await usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, newUser.username)
    assert.strictEqual(response.body.name, newUser.name)

    const usersAtEnd = await usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length - 1)
  })

  test('user without username is not added', async () => {
    const newUser = {
      name: 'New User',
      password: 'test123'
    }

    const usersAtStart = await usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('user without password is not added', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User'
    }

    const usersAtStart = await usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('user is not added if password length is 2 characters', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'pw'
    }

    const usersAtStart = await usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('user is not added if username length is 2 characters', async () => {
    const newUser = {
      username: 'nu',
      name: 'New User',
      password: 'password'
    }

    const usersAtStart = await usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test("same username can't be added twice", async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'test123'
    }

    await api.post('/api/users').send(newUser)

    const usersAtStart = await usersInDb()

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  after(() => {
    mongoose.connection.close()
  })
})