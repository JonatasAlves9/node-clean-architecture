import { type HttpGetClient } from '@/infra/http'
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get (args: HttpGetClient.Params): Promise<void> {
    await axios.get(args.url, {
      params: args.params
    })
  }
}

describe('AxiosHttp', () => {
  describe('get', () => {
    it('should call get with correct params', async () => {
      const sut = new AxiosHttpClient()
      const fakeAxios = axios as jest.Mocked<typeof axios>

      await sut.get({
        url: 'any_url',
        params: {
          any: 'any'
        }
      })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url',
        {
          params: {
            any: 'any'
          }
        })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
