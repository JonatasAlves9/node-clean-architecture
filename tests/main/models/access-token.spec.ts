import { AccessToken } from '@/domain/models'

describe('Access Token', () => {
  it('should create with a value', () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({
      value: 'any_value'
    })
  })
})
