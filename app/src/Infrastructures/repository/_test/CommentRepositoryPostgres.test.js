const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment method', () => {
    it('should presist new comment and return added comment correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding'
      })
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId })
      const commentUserId = await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'commenter'
      })

      const newComment = {
        threadId,
        content: 'thread comment',
        owner: commentUserId
      }

      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)
      const addedComment = await commentRepositoryPostgres.addComment(newComment)

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: `comment-${fakeIdGenerator()}`,
          content: 'thread comment',
          owner: commentUserId
        })
      )

      const dataComments = await CommentsTableTestHelper.findCommentById(addedComment.id)

      expect(dataComments).toHaveLength(1)
    })
  })

  describe('verifyCommentAccess method', () => {
    it('should throw 404 error when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const payload = {
        commentId: 'comment-123',
        threadId: 'thread-123',
        credentialId: 'user-123'
      }

      await expect(
        commentRepositoryPostgres.verifyCommentAccess(payload)
      ).rejects.toThrow(NotFoundError)
    })

    it('should throw Authorization error when cannot access resource', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' })
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId })

      const commenterId = await UsersTableTestHelper.addUser({
        id: 'user-000',
        username: 'commenter'
      })

      const commentId = await CommentsTableTestHelper.addComment({
        threadId,
        owner: commenterId
      })

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const payload = {
        commentId,
        threadId,
        credentialId: ownerId
      }

      await expect(
        commentRepositoryPostgres.verifyCommentAccess(payload)
      ).rejects.toThrow(AuthorizationError)
    })

    it('should not throw error when comment is exist and can access resource', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' })
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId })

      const commenterId = await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commenter' })
      const commentId = await CommentsTableTestHelper.addComment({ threadId, owner: commenterId })

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const payload = {
        commentId,
        threadId,
        credentialId: commenterId
      }

      await expect(
        commentRepositoryPostgres.verifyCommentAccess(payload)
      ).resolves.not.toThrow(AuthorizationError)
    })
  })

  describe('deleteCommentById method', () => {
    it('should delete comment correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' })
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId })
      const commentId = await CommentsTableTestHelper.addComment({ threadId, owner: ownerId })

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const deletedId = await commentRepositoryPostgres.deleteCommentById(commentId)

      const deletedComment = await CommentsTableTestHelper.findCommentById(commentId)

      expect(deletedId).toEqual(commentId)
      expect(deletedComment[0].is_delete).toBeTruthy()
    })
  })

  describe('getCommentsByThreadId method', () => {
    it('should return comments correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'dicoding'
      })

      const threadId1 = await ThreadsTableTestHelper.addThread({
        id: 'thread-001',
        owner: ownerId
      })

      const threadId2 = await ThreadsTableTestHelper.addThread({
        id: 'thread-002',
        owner: ownerId
      })

      const commenterId1 = await UsersTableTestHelper.addUser({
        id: 'user-001',
        username: 'alice'
      })

      const commenterId2 = await UsersTableTestHelper.addUser({
        id: 'user-002',
        username: 'bob'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-001',
        threadId: threadId1,
        owner: commenterId1,
        content: 'alice thread comment content'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-002',
        threadId: threadId1,
        owner: commenterId2,
        content: 'bob thread comment content'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-003',
        threadId: threadId2,
        owner: commenterId2
      })

      await CommentsTableTestHelper.deleteCommentById('comment-002')

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const results = await commentRepositoryPostgres.getCommentsByThreadId(threadId1)

      expect(results).toHaveLength(2)
      const [comment1, comment2] = results

      expect(comment1.id).toEqual('comment-001')
      expect(comment1.username).toEqual('alice')
      expect(comment1.date).toBeDefined()
      expect(comment1.content).toEqual('alice thread comment content')

      expect(comment2.id).toEqual('comment-002')
      expect(comment2.username).toEqual('bob')
      expect(comment1.date).toBeDefined()
      expect(comment2.content).toEqual('**komentar telah dihapus**')
    })
  })
})
