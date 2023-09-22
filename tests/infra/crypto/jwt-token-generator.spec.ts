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
  it('should call sign with correct params', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>
    const sut = new JwtTokenGenerator('any_secret')

    await sut.generateToken({
      expirationInMs: 1000,
      key: 'any_key'
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith({
      key: 'any_key'
    }, 'any_secret', {
      expiresIn: 1
    })
  })
})
