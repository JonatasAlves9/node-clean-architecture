export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => Promise<TokenGenerator.Result>
}

export namespace TokenGenerator {
  export interface Params {
    key: string
    expirationInMs: number
  }

  export type Result = string
}
