export interface LoadUserAccountRepository {
  perform: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export interface Params {
    email: string
  }

  export type Result = undefined | {
    result: string
  }
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>
}

export namespace CreateFacebookAccountRepository {
  export interface Params {
    email: string
    name: string
    facebookId: string
  }

  export type Result = undefined | {
    result: string
  }
}
