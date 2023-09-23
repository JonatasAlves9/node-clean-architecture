import { type FacebookAuthentication } from '@/domain/features'
import { mock, type MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return {
        statusCode: 400,
        data: new Error('the field token is required')
      }
    }
    const result = await this.facebookAuthentication.perform({
      token: httpRequest.token
    })

    return {
      statusCode: 401,
      data: result
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

  it('should return 401 if authentication fails', async () => {
    facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({
      token: 'any_token'
    })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })
})
