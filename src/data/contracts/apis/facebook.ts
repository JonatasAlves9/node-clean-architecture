export interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>
}

export namespace LoadFacebookUserApi {
  export interface Params {
    token: string
  }

  export type Result = undefined
}
