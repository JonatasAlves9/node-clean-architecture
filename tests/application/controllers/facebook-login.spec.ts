import { type FacebookAuthentication } from '@/domain/features'
import { mock, type MockProxy } from 'jest-mock-extended'

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
  let sut: FacebookLoginController
  let facebookAuthentication: MockProxy<FacebookAuthentication>

  beforeAll(() => {
    facebookAuthentication = mock()
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuthentication)
  })
  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({
      token: ''
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({
      token: null
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('should call facebookAuthentication with correct params', async () => {
    await sut.handle({
      token: 'any_token'
    })

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1)
  })
})
