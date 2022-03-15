class AuthenticationsHandler {
  constructor(container) {
    this.container = container

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
  }

  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this.container.resolve('LoginUserUseCase')
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload)
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthenticationHandler(request) {
    const refreshAuthenticationUseCase = this.container.resolve('RefreshAuthenticationUseCase')
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload)

    return {
      status: 'success',
      data: {
        accessToken
      }
    }
  }

  async deleteAuthenticationHandler(request) {
    const logoutUserUseCase = this.container.resolve('LogoutUserUseCase')
    await logoutUserUseCase.execute(request.payload)
    return {
      status: 'success'
    }
  }
}

module.exports = AuthenticationsHandler
