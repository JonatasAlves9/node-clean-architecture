import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'

interface SubTypes {
  sut: FacebookAuthenticationService
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
}

const makeSut = (): SubTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>()
  const sut = new FacebookAuthenticationService(loadFacebookUserApi)

  return {
    sut,
    loadFacebookUserApi
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApi } = makeSut()

    await sut.perform({
      token: 'any_token'
    })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut()

    loadFacebookUserApi.loadUser.mockResolvedValue(undefined)

    const authResult = await sut.perform({
      token: 'any_token'
    })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
