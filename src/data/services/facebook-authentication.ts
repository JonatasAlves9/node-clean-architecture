import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { type LoadUserAccountRepository } from '@/data/contracts/repos'

export class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserApi: LoadFacebookUserApi, private readonly loadUserAccountRepo: LoadUserAccountRepository) {
  }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser({ token: params.token })

    if (fbData !== undefined) {
      await this.loadUserAccountRepo.perform({ email: fbData.email })
    }
    return new AuthenticationError()
  }
}
