export interface LoadUserAccountRepository {
  perform: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export interface Params {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebookAccountRepository.Params) => Promise<SaveFacebookAccountRepository.Result>
}

export namespace SaveFacebookAccountRepository {
  export interface Params {
    id?: string
    email: string
    name: string
    facebookId: string
  }

  export interface Result {
    id: string
  }
}
