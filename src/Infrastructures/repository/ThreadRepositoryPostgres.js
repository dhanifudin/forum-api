const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this.pool = pool
    this.idGenerator = idGenerator
  }

  async addThread ({ title, body, owner }) {
    const id = `thread-${this.idGenerator()}`

    const query = {
      text: `INSERT INTO threads (id, title, body, owner)
             VALUES ($1, $2, $3, $4)
             RETURNING id, title, owner`,
      values: [id, title, body, owner]
    }

    const result = await this.pool.query(query)
    return new AddedThread({ ...result.rows[0] })
  }

  async getThreadById (id) {
    const query = {
      text: `SELECT threads.id, title, body, date, username
            FROM threads
            JOIN users ON users.id = threads.owner
            WHERE threads.id = $1`,
      values: [id]
    }

    const { rows, rowCount } = await this.pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('thread not found')
    }

    return rows[0]
  }

  async verifyAvailableThreadById (id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id]
    }

    const { rowCount } = await this.pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('thread not found')
    }
  }
}

module.exports = ThreadRepositoryPostgres
