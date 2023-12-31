import { type HttpGetClient } from '@/infra/http/client'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get<T = any>(args: HttpGetClient.Params): Promise<T> {
    const result = await axios.get<T>(args.url, {
      params: args.params
    })

    return result.data
  }
}
