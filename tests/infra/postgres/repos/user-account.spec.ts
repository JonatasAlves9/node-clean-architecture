import { type LoadUserAccountRepository } from '@/data/contracts/repos'
import { newDb } from 'pg-mem'

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

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
  const db = newDb()

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

  describe('load', () => {
    it('should return an account if email exists', async () => {
      const connection = await db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.initialize()
      await connection.synchronize()

      const pgUserRepo = PgUser.getRepository()
      await pgUserRepo.save({ email: 'existing_email' })
      const sut = new PgUserAccountRepository()

      const account = await sut.perform({
        email: 'existing_email'
      })

      expect(account).toEqual({
        id: '1'
      })
    })
  })
})
