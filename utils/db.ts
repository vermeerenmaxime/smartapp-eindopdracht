import {
  openDatabase,
  Database,
  SQLTransaction,
  Query,
  SQLResultSet,
  SQLError
} from 'expo-sqlite'
import Note from '../models/Note'
import Story from '../models/Story'

const databaseName: string = 'travler'

const getDb = (name: string = databaseName): Database => {
  // Opent de db als deze bestaat, maakt db aan als deze nog niet bestaat.
  // DB INIT -> zou vanzelf moeten lukken.
  return openDatabase(name)
}

const transaction = (db: Database): Promise<SQLTransaction> => {
  return new Promise(function (resolve, reject) {
    db.transaction(
      (tx: SQLTransaction) => {
        resolve(tx)
      },
      error => {
        reject(error)
      },
      () => {
        console.info('Transaction succeeded 🥳.')
      }
    )
  })
}

const query = (tx: SQLTransaction, query: Query): Promise<SQLResultSet> => {
  return new Promise(function (resolve, reject) {
    tx.executeSql(
      query.sql,
      query.args,
      (tx: SQLTransaction, res: SQLResultSet) => {
        resolve(res)
      },
      (tx: SQLTransaction, error: SQLError) => {
        reject(error)
        return true
      }
    )
  })
}

// ALLES PREPARED!
// TABLE INIT
export const initTravler = async () => {
  const db = getDb()
  const tx = await transaction(db).catch(error => console.error(error))

  if (tx) {
    await query(tx, {
      sql:
        'CREATE TABLE IF NOT EXISTS `story` (id integer primary key autoincrement, title text, author text, description text, image string)',
      args: []
    })
    await query(tx, {
      sql:
        'CREATE TABLE IF NOT EXISTS `storyArticles` (storyId integer, articleId integer)',
      args: []
    })
    await query(tx, {
      sql:
        'CREATE TABLE IF NOT EXISTS `article` (id integer primary key autoincrement, title text,note text)',
      args: []
    })
    await query(tx, {
      sql:
        'CREATE TABLE IF NOT EXISTS `articleImages` (storyId integer, imageId integer)',
      args: []
    })
    await query(tx, {
      sql:
        'CREATE TABLE IF NOT EXISTS `articleImage` (id integer primary key autoincrement, image text)',
      args: []
    })
  }
}

export const travler = {
  // C reate
  createStory: (s: Story): Promise<SQLResultSet> => {
    return new Promise(async function (resolve, reject) {
      const db = getDb(),
        tx = await transaction(db)

      const res = await query(tx, {
        sql:
          'INSERT INTO `story` (id, title, author, description,image) values(?, ?, ?, ?)',
        args: [null, s.title, s.author, s.description, s.image]
      }).catch(error => {
        reject(error)
      })

      if (res) resolve(res)
    })
  },

  // R ead
  read: {
    all: (): Promise<SQLResultSet> => {
      return new Promise(async function (resolve, reject) {
        const db = getDb(),
          tx = await transaction(db)

        const res = await query(tx, {
          sql: 'SELECT * FROM `story`',
          args: []
        }).catch(error => {
          reject(error)
        })

        if (res) resolve(res)
      })
    },
    detail: (id: number): Promise<SQLResultSet> => {
      return new Promise(async function (resolve, reject) {
        const db = getDb(),
          tx = await transaction(db)

        const res = await query(tx, {
          sql: 'SELECT * FROM `story` WHERE id = ?',
          args: [id]
        }).catch(error => {
          reject(error)
        })

        if (res) resolve(res)
      })
    }
  },

  // U pdate
  update: (n: Note): Promise<SQLResultSet> => {
    return new Promise(async function (resolve, reject) {
      const db = getDb(),
        tx = await transaction(db)

      const res = await query(tx, {
        sql:
          'UPDATE `writings` SET title = ? , author = ? , note = ? WHERE id = ?',
        args: [n.title, n.author, n.text, n.id]
      }).catch(error => {
        reject(error)
      })

      if (res) resolve(res)
    })
  },

  // D elete
  delete: (id: number): Promise<SQLResultSet> => {
    return new Promise(async function (resolve, reject) {
      const db = getDb(),
        tx = await transaction(db)

      const res = await query(tx, {
        sql: 'DELETE FROM `writings` WHERE id = ?',
        args: [id]
      }).catch(error => {
        reject(error)
      })

      if (res) resolve(res)
    })
  }
}
