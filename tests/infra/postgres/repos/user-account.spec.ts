import { type IBackup, type IMemoryDb, newDb } from 'pg-mem'

import { type Repository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
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

  const connection = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.initialize()
  await connection.synchronize()
  return db
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let backup: IBackup
    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      backup = db.backup()
      pgUserRepo = PgUser.getRepository()
    })

    beforeEach(async () => {
      backup.restore() // clear dataset
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
