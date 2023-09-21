export interface LoadUserAccountRepository {
  perform: (params: LoadUserAccountRepository.Params) => Promise<void>
}

export namespace LoadUserAccountRepository {
  export interface Params {
    email: string
  }
}
