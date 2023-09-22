import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { type LoadUserAccountRepository, type SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { type TokenGenerator } from '@/data/contracts/crypto'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {
  }

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser({ token: params.token })

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.perform({ email: fbData.email })

      const fbAccount = new FacebookAccount(fbData, accountData)

      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })

      return new AccessToken(token)
    }
    return new AuthenticationError()
  }
}
