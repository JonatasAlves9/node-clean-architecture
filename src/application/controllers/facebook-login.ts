import { type FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { badRequest, type HttpResponse, unauthorized } from '@/application/helpers'
import { RequiredFieldError, ServerError } from '@/application/errors'

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }
      const access_token = await this.facebookAuthentication.perform({
        token: httpRequest.token
      })

      if (access_token instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: access_token.value
          }
        }
      } else {
        return unauthorized()
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error as Error)
      }
    }
  }
}
