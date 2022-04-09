const NewThread = require('../../Domains/threads/entities/NewThread')

class AddThreadUseCase {
  constructor ({ threadRepository }) {
    this.threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const newThread = new NewThread(useCasePayload)
    const addedThread = await this.threadRepository.addThread(newThread)
    return addedThread
  }
}

module.exports = AddThreadUseCase
