import { type FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { badRequest, type HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation'

interface HttpRequest {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error !== undefined) {
        return badRequest(error)
      }
      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token
      })

      if (accessToken instanceof AccessToken) {
        return ok({
          accessToken: accessToken.value
        })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }

  validate = (httpRequest: HttpRequest): Error | undefined => {
    return new ValidationComposite([
      new RequiredStringValidator(httpRequest.token, 'token')
    ]).validate()
  }
}
