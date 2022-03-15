const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase')

describe('GetThreadDetailUseCase', () => {
  it('should return thread detail correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123'
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve({ id: 'thread-123' })
    )

    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve([{ id: 'comment-123' }])
    )

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
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

    expect(thread.id).toEqual(useCasePayload.threadId)
    expect(thread.comments).toHaveLength(1)
    expect(thread.comments[0].id).toEqual('comment-123')
  })
})
