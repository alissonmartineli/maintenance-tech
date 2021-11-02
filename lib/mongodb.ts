import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''

let client: any = null

let cachedClient: any = null
let cachedDb: any = null

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri)
      global._mongoClientPromise = await client.connect()
    } else {
      client = global._mongoClientPromise
    }
  } else {
    client = new MongoClient(uri)
  }

  await client.connect()

  const db = await client.db()

  cachedClient = client
  cachedDb = db

  return { client, db }
}
