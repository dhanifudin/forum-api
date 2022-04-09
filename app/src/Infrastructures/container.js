/* istanbul ignore file */
const { createContainer, asValue, asClass, InjectionMode } = require('awilix')

const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres')

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase')
const JwtTokenManager = require('./security/JwtTokenManager')
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase')
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase')
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase')
const GetThreadDetailUseCase = require('../Applications/use_case/GetThreadDetailUseCase')

const container = createContainer({ injectionMode: InjectionMode.PROXY })

container.register({
  userRepository: asValue(new UserRepositoryPostgres(pool, nanoid)),
  authenticationRepository: asValue(new AuthenticationRepositoryPostgres(pool)),
  passwordHash: asValue(new BcryptPasswordHash(bcrypt)),
  authenticationTokenManager: asValue(new JwtTokenManager(Jwt.token)),
  threadRepository: asValue(new ThreadRepositoryPostgres(pool, nanoid)),
  commentRepository: asValue(new CommentRepositoryPostgres(pool, nanoid)),
  AddUserUseCase: asClass(AddUserUseCase),
  LoginUserUseCase: asClass(LoginUserUseCase),
  LogoutUserUseCase: asClass(LogoutUserUseCase),
  RefreshAuthenticationUseCase: asClass(RefreshAuthenticationUseCase),
  AddThreadUseCase: asClass(AddThreadUseCase),
  AddCommentUseCase: asClass(AddCommentUseCase),
  DeleteCommentUseCase: asClass(DeleteCommentUseCase),
  GetThreadDetailUseCase: asClass(GetThreadDetailUseCase)
})

module.exports = container
