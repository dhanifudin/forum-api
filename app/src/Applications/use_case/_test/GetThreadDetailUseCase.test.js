const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase')

describe('GetThreadDetailUseCase', () => {
  it('should return thread detail correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123'
    }

    const expectedThreadDetail = new ThreadDetail({
      id: useCasePayload.threadId,
      title: 'thread title',
      body: 'thread body',
      date: new Date(),
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          username: 'user-123',
          date: new Date(),
          content: 'comment content'
        }
      ]
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve({ id: 'thread-123', title: 'thread title', body: 'thread body', date: new Date(), username: 'user-123' })
    )

    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve([{ id: 'comment-123', username: 'user-123', date: new Date(), content: 'comment content' }])
    )

    const getThreadDetailUseCase = new
    GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    const thread = await getThreadDetailUseCase.execute(useCasePayload)

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    )

    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId
    )

    expect(thread.id).toEqual(expectedThreadDetail.id)
    expect(thread.title).toEqual(expectedThreadDetail.title)
    expect(thread.body).toEqual(expectedThreadDetail.body)
    expect(thread.date).toBeDefined()
    expect(thread.username).toEqual(expectedThreadDetail.username)
    expect(thread.comments).toHaveLength(1)
    expect(thread.comments[0].id).toEqual(expectedThreadDetail.comments[0].id)
    expect(thread.comments[0].username).toEqual(expectedThreadDetail.comments[0].username)
    expect(thread.comments[0].date).toBeDefined()
    expect(thread.comments[0].content).toEqual(expectedThreadDetail.comments[0].content)
  })
})
