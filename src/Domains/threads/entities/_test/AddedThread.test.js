const AddedThread = require('../AddedThread')

describe('AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'dicoding thread'
    }

    expect(() => new AddedThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should thow error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'dicoding thread',
      owner: true
    }

    expect(() => new AddedThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create newThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'dicoding thread',
      owner: 'user-123'
    }

    const newThread = new AddedThread(payload)

    expect(newThread.title).toEqual(payload.title)
    expect(newThread.body).toEqual(payload.body)
    expect(newThread.owner).toEqual(payload.owner)
  })
})
