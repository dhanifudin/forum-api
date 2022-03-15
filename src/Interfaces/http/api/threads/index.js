const ThreadHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'threads',
  version: '1.0.0',
  register: async (server, { container }) => {
    const handler = new ThreadHandler(container)
    server.route(routes(handler))
  }
}
