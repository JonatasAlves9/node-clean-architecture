import { type LoadUserAccountRepository } from '@/data/contracts/repos'
import { type IBackup, type IMemoryDb, newDb } from 'pg-mem'

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, type Repository } from 'typeorm'

class PgUserAccountRepository implements LoadUserAccountRepository {
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
}

@Entity({
  name: 'usuarios'
})
export class PgUser extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: number
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let db: IMemoryDb
    let backp: IBackup
    beforeAll(async () => {
      db = newDb()

      db.public.registerFunction({
        name: 'current_database',
        args: [],
        implementation: () => 'my_database_name'
      })
      db.public.registerFunction({
        name: 'version',
        args: [],
        implementation: () => '1'
      })

      const connection = await db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.initialize()
      await connection.synchronize()

      backp = db.backup()
      pgUserRepo = PgUser.getRepository()
    })

    beforeEach(async () => {
      backp.restore() // clear dataset
      sut = new PgUserAccountRepository()
    })
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })

      const account = await sut.perform({
        email: 'existing_email'
      })

      expect(account).toEqual({ id: '1' })
    })

    it('should return an account if not email exists', async () => {
      const account = await sut.perform({
        email: 'existing_email'
      })

      expect(account).toBeUndefined()
    })
  })
})
