export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => Promise<void>
}

export namespace TokenGenerator {
  export interface Params {
    key: string
  }
}
