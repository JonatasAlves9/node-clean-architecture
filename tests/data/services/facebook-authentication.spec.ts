import {AuthenticationError} from '@/domain/errors'
import {type LoadFacebookUserApi} from '@/data/contracts/apis'
import {FacebookAuthenticationService} from '@/data/services'


describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const facebookApi = {
      loadUser: jest.fn()
    }
    const sut = new FacebookAuthenticationService(facebookApi)

    await sut.perform({
      token: 'any_token'
    })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const facebookApi = {
      loadUser: jest.fn()
    }
    facebookApi.loadUser.mockResolvedValue(undefined)
    const sut = new FacebookAuthenticationService(facebookApi)

    const authResult = await sut.perform({
      token: 'any_token'
    })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
