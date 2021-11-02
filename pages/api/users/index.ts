// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb'

type UserType = {
  _id?: string
  name: string
  email: string
}

type ErrorType = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserType | UserType[] | ErrorType>
) {
  try {
    const { db } = await connectToDatabase()
    if (req.method === 'GET') {
      const users = await db.collection('users').find({}).toArray()

      return res.status(200).json(users)
    } else if (req.method === 'POST') {
      const user = req.body as UserType

      const result = await db.collection('users').insertOne(user)

      result
        ? res.status(201).json({ ...user, _id: result.insertedId })
        : res.status(500).end()
    }
  } catch (error: any) {
    return res.status(400).send({ message: error.message })
  }

  return res.status(404).end()
}
