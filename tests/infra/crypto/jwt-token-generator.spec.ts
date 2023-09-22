import jwt from 'jsonwebtoken'
import { type TokenGenerator } from '@/data/contracts/crypto'

class JwtTokenGenerator {
  constructor (private readonly secret: string) {
  }

  async generateToken (params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000
    jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds
    })
  }
}

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string
  let key: string

  beforeAll(() => {
    secret = 'any_secret'
    key = 'any_key'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })
  beforeEach(() => {
    sut = new JwtTokenGenerator(secret)
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({
      expirationInMs: 1000,
      key
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
  })
})
