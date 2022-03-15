/* eslint-disable camelcase */

const TABLE_NAME = 'threads'

exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })

  pgm.createConstraint(
    TABLE_NAME,
    'fk_threads.owner_users_id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropConstraint(TABLE_NAME, 'fk_threads.owner_users_id')
  pgm.dropTable(TABLE_NAME)
}
