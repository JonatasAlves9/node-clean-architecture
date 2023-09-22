import { FacebookAuthenticationService } from '@/data/services'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'
import {
  type SaveFacebookAccountRepository,
  type LoadUserAccountRepository
} from '@/data/contracts/repos'

import mocked = jest.mocked
import { mock, type MockProxy } from 'jest-mock-extended'
import { type TokenGenerator } from '@/data/contracts/crypto'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthentication
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>

  let token: string

  // Perform tests
  beforeAll(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    userAccountRepo = mock()
    userAccountRepo.perform.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id'
    })

    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_value')
  })

  beforeEach(() => {
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo, crypto)
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

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      name: 'any_name'
    }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      name: 'any_name'
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an accessToken on success', async () => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_value'))
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow('fb_error')
  })

  it('should rethrow if SaveWithFacebookError throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_with_facebook_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow('save_with_facebook_error')
  })

  it('should rethrow if SaveWithFacebookError throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_with_facebook_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow('save_with_facebook_error')
  })

  it('should rethrow if PerformUserAccount throws', async () => {
    userAccountRepo.perform.mockRejectedValueOnce(new Error('perform_account'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow('perform_account')
  })

  it('should rethrow if Crypto throws', async () => {
    crypto.generateToken.mockRejectedValue(new Error('generate_token_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow('generate_token_error')
  })
})
