import { type FacebookAuthentication } from '@/domain/features'
import { mock } from 'jest-mock-extended'

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform({
      token: httpRequest.token
    })
    return {
      statusCode: 400,
      data: new Error('the field token is required')
    }
  }
}

interface HttpResponse {
  statusCode: number
  data: any
}

describe('FacebookLogin', () => {
  it('should return 400 if token is empty', async () => {
    const facebookAuthentication = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuthentication)

    const httpResponse = await sut.handle({
      token: ''
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const facebookAuthentication = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuthentication)

    const httpResponse = await sut.handle({
      token: null
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('should call facebookAuthentication with correct params', async () => {
    const facebookAuthentication = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuthentication)

    await sut.handle({
      token: 'any_token'
    })

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1)
  })
})
