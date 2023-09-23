import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

import { type IBackup } from 'pg-mem'
import { type Repository } from 'typeorm'

describe('PgUserAccountRepository', () => {
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

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })

      const account = await sut.perform({
        email: 'existing_email'
      })

      expect(account).toEqual({ id: '1' })
    })

    it('should return an account if email does not exists', async () => {
      const account = await sut.perform({
        email: 'existing_email'
      })

      expect(account).toBeUndefined()
    })
  })

  describe('SaveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const pgUser = await pgUserRepo.findOneBy({ email: 'any_email' })

      expect(pgUser?.id).toBe(1)
      expect(id).toBe('1')
    })

    it('should update an account if id is defined', async () => {
      await pgUserRepo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const { id } = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })

      const pgUser = await pgUserRepo.findOneBy({ id: 1 })

      expect(pgUser).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      expect(id).toBe('1')
    })
  })
})
