import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type FacebookAuthentication } from '@/domain/features'
import {
  type CreateFacebookAccountRepository,
  type LoadUserAccountRepository,
  type UpdateFacebookAccountRepository
} from '@/data/contracts/repos'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthentication
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>
  let facebookApi: MockProxy<LoadFacebookUserApi>

  let token: string

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    userAccountRepo.perform.mockResolvedValue(undefined)

    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo)
  })
  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({
      token
    })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token
    })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({
      token
    })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.perform).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.perform).toHaveBeenCalledTimes(1)
  })

  it('should call CreateFacebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateFacebookAccountRepo when LoadUserAccountRepo returns data', async () => {
    userAccountRepo.perform.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    userAccountRepo.perform.mockResolvedValueOnce({
      id: 'any_id'
    })

    await sut.perform({ token })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
