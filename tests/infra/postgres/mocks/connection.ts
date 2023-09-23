import { type IMemoryDb, newDb } from 'pg-mem'

export const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
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
