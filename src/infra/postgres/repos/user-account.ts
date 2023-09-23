import { type LoadUserAccountRepository, type SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async perform (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = PgUser.getRepository()

    const pgUser = await pgUserRepo.findOneBy({
      email: params.email
    })

    if (pgUser !== null) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<void> {
    const pgUserRepo = PgUser.getRepository()

    await pgUserRepo.save({
      email: params.email,
      name: params.name,
      facebookId: params.facebookId
    })
  }
}
