const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread method', () => {
    it('should persist new thread and return added thread correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' })

      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
        owner: ownerId
      }

      const newThread = new NewThread(threadPayload)

      const fakeIdGenerator = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      const addedThread = await threadRepositoryPostgres.addThread(newThread)

      const threads = await ThreadsTableTestHelper.findThreadById(`thread-${fakeIdGenerator()}`)

      expect(addedThread.id).toEqual(`thread-${fakeIdGenerator()}`)
      expect(addedThread.title).toEqual(threadPayload.title)
      expect(addedThread.owner).toEqual(threadPayload.owner)

      expect(threads).toHaveLength(1)
      expect(threads[0].id).toEqual(`thread-${fakeIdGenerator()}`)
      expect(threads[0].title).toEqual(threadPayload.title)
      expect(threads[0].body).toEqual(threadPayload.body)
      expect(threads[0].owner).toEqual(threadPayload.owner)
    })
  })

  describe('getThreadById', () => {
    it('should throw notFound error when thread not found', async () => {
      const threadId = 'thread-000'

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      await expect(
        threadRepositoryPostgres.getThreadById(threadId)
      ).rejects.toThrow(NotFoundError)
    })

    it('should return correct thread', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' })
      const threadId = await ThreadsTableTestHelper.addThread({
        title: 'thread title',
        body: 'thread body',
        owner: ownerId
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      const thread = await threadRepositoryPostgres.getThreadById(threadId)

      expect(thread.id).toEqual(threadId)
      expect(thread.title).toEqual('thread title')
      expect(thread.body).toEqual('thread body')
      expect(thread.date).toBeDefined()
      expect(thread.username).toEqual('dicoding')
    })
  })

  describe('verifyAvailableThreadById', () => {
    it('should throw not found error when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      await expect(
        threadRepositoryPostgres.verifyAvailableThreadById('thread-000')
      ).rejects.toThrow(NotFoundError)
    })

    it('should not found error when thread is found', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' })
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      await expect(
        threadRepositoryPostgres.verifyAvailableThreadById(threadId)
      ).resolves.not.toThrow()
    })
  })
})
