const CommentsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'comments',
  version: '1.0.0',
  register: async (server, { container }) => {
    const handler = new CommentsHandler(container)
    server.route(routes(handler))
  }
}
