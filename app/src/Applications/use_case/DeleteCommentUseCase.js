class DeleteCommentUseCase {
  constructor ({ commentRepository }) {
    this.commentRepository = commentRepository
  }

  async execute (useCasePayload) {
    await this.commentRepository.verifyCommentAccess(useCasePayload)
    await this.commentRepository.deleteCommentById(useCasePayload.commentId)
  }
}

module.exports = DeleteCommentUseCase
