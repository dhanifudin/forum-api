class ThreadHandler {
  constructor (container) {
    this.container = container
    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this)
  }

  async postThreadHandler ({ auth, payload }, h) {
    const { id: credentialId } = auth.credentials
    const addThreadUseCase = this.container.resolve('AddThreadUseCase')
    const addedThread = await addThreadUseCase.execute({
      ...payload,
      owner: credentialId
    })

    const response = h.response({
      status: 'success',
      data: { addedThread }
    })

    response.code(201)
    return response
  }

  async getThreadByIdHandler ({ params }) {
    const getThreadDetailUseCase = this.container.resolve('GetThreadDetailUseCase')

    const thread = await getThreadDetailUseCase.execute(params)

    return {
      status: 'success',
      data: { thread }
    }
  }
}

module.exports = ThreadHandler
