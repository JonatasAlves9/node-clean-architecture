import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { type LoadUserAccountRepository, type SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository) {
  }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser({ token: params.token })

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.perform({ email: fbData.email })

      const fbAccount = new FacebookAccount(fbData, accountData)

      await this.userAccountRepo.saveWithFacebook(fbAccount)
    }
    return new AuthenticationError()
  }
}
