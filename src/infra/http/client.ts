export interface HttpGetClient {
  get: <T = any>(params: HttpGetClient.Params) => Promise<T>
}

export namespace HttpGetClient {
  export interface Params {
    url: string
    params: object
  }
}
