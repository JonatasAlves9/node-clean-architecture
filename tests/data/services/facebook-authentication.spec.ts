import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type FacebookAuthentication } from '@/domain/features'
import { type CreateFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthentication
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>

  let token: string

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepo = mock()
    createFacebookAccountRepo = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo, createFacebookAccountRepo)
  })
  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({
      token
    })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token
    })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({
      token
    })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(loadUserAccountRepo.perform).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepo.perform).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    loadUserAccountRepo.perform.mockResolvedValueOnce(undefined)

    await sut.perform({ token })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
