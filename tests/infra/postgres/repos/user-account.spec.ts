import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

import { type IBackup } from 'pg-mem'
import { type Repository } from 'typeorm'

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
