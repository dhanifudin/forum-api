const NewComment = require('../../Domains/comments/entities/NewComment')

class AddCommentUseCase {
  constructor ({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository
    this.threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const newComment = new NewComment(useCasePayload)
    await this.threadRepository.verifyAvailableThreadById(newComment.threadId)
    return this.commentRepository.addComment(newComment)
  }
}

module.exports = AddCommentUseCase
