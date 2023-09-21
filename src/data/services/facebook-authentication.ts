import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import {
  type CreateFacebookAccountRepository,
  type LoadUserAccountRepository,
  type UpdateFacebookAccountRepository
} from '@/data/contracts/repos'

export class FacebookAuthenticationService {
  constructor (private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository) {
  }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser({ token: params.token })

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.perform({ email: fbData.email })

      if (accountData !== undefined) {
        await this.userAccountRepo.updateWithFacebook({
          facebookId: fbData.facebookId,
          name: accountData.name ?? fbData.name,
          id: accountData.id
        })
      } else {
        await this.userAccountRepo.createFromFacebook(fbData)
      }
    }
    return new AuthenticationError()
  }
}
