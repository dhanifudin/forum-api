const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted threads', async () => {
      const server = await createServer(container)

      const registerPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      }

      const loginPayload = {
        username: 'dicoding',
        password: 'secret'
      }

      const threadPayload = {
        title: 'thread title',
        body: 'thread body'
      }

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerPayload
      })

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload
      })

      const { data: { accessToken } } = JSON.parse(loginResponse.payload)

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      const thread = JSON.parse(threadResponse.payload)
      const result = await ThreadsTableTestHelper.findThreadById(thread.data.addedThread.id)

      expect(threadResponse.statusCode).toEqual(201)
      expect(result).toHaveLength(1)
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail correctly', async () => {
      const server = await createServer(container)
      const threadOwnerId = await UsersTableTestHelper.addUser({
        id: 'user-001',
        username: 'dicoding'
      })
      const threadCommenterId1 = await UsersTableTestHelper.addUser({
        id: 'user-002',
        username: 'alice'
      })
      const threadCommenterId2 = await UsersTableTestHelper.addUser({
        id: 'user-003',
        username: 'bob'
      })

      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-001',
        owner: threadOwnerId
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-001',
        owner: threadCommenterId1,
        threadId,
        content: 'comment 1'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-002',
        owner: threadCommenterId2,
        threadId,
        content: 'comment 2'
      })

      const getThreadResponse = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })

      const responseJson = JSON.parse(getThreadResponse.payload)
      expect(getThreadResponse.statusCode).toEqual(200)
      expect(responseJson.data.thread.id).toEqual(threadId)
      expect(responseJson.data.thread.username).toEqual('dicoding')
      expect(responseJson.data.thread.comments).toHaveLength(2)
    })
  })
})
