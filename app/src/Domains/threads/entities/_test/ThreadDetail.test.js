const ThreadDetail = require('../ThreadDetail')

describe('ThreadDetail entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: new Date(),
      comments: []
    }

    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: new Date(),
      username: 'dicoding',
      comments: 'comments'
    }

    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create threadDetail object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: new Date(),
      username: 'dicoding',
      comments: []
    }

    const threadDetail = new ThreadDetail(payload)

    expect(threadDetail.id).toEqual(payload.id)
    expect(threadDetail.title).toEqual(payload.title)
    expect(threadDetail.body).toEqual(payload.body)
    expect(threadDetail.date).toEqual(payload.date)
    expect(threadDetail.username).toEqual(payload.username)
    expect(threadDetail.comments).toEqual(payload.comments)
  })
})
