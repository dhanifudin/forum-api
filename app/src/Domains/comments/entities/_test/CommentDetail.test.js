const CommentDetail = require('../CommentDetail')

describe('CommentDetail entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date(),
      content: 'comment content'
    }

    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'comment content',
      is_delete: 'true'
    }

    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should transform content to deleted when is_delete is true', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'comment content',
      is_delete: true
    }

    const commentDetail = new CommentDetail(payload)

    expect(commentDetail.content).toBe('**komentar telah dihapus**')
  })

  it('should create commentDetail object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'comment content',
      is_delete: false
    }

    const commentDetail = new CommentDetail(payload)

    expect(commentDetail.id).toEqual(payload.id)
    expect(commentDetail.username).toEqual(payload.username)
    expect(commentDetail.date).toEqual(payload.date)
    expect(commentDetail.content).toEqual(payload.content)
    expect(commentDetail).not.toHaveProperty('is_delete')
  })
})
