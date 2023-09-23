import { type LoadUserAccountRepository, type SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepo = PgUser.getRepository()

  async perform (params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOneBy({
      email: params.email
    })

    if (pgUser !== null) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveParams): Promise<SaveResult> {
    let id: string
    if (params.id === undefined) {
      const pgUser = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
      id = pgUser.id.toString()
    } else {
      id = params.id
      await this.pgUserRepo.update({ id: parseInt(params.id) }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }
    return { id }
  }
}
