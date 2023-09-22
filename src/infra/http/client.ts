export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<HttpGetClient.Result>
}

export namespace HttpGetClient {
  export interface Params {
    url: string
    params: object
  }

  export type Result = any
}
