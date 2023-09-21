import { FacebookAccount } from '@/domain/models'

describe('', () => {
  it('should create with facebook data only', () => {
    const sut = new FacebookAccount({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(sut).toEqual({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })
})
