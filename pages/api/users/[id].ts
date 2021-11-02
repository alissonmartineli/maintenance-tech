// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId } from 'mongodb'
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
  res: NextApiResponse<UserType | ErrorType>
) {
  try {
    const id = req.query.id as string
    const { db } = await connectToDatabase()

    if (req.method === 'GET') {
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(id) })

      if (!user) {
        return res.status(404).end()
      }

      return res.status(200).json(user)
    } else if (req.method === 'PUT') {
      const user = req.body as UserType

      const result = await db
        .collection('users')
        .updateOne({ _id: new ObjectId(id) }, { $set: user })

      result ? res.status(200).end() : res.status(500).end()
    } else if (req.method === 'DELETE') {
      const result = await db
        .collection('users')
        .deleteOne({ _id: new ObjectId(id) })

      result ? res.status(200).end() : res.status(500).end()
    }
  } catch (error: any) {
    return res.status(400).send({ message: error.message })
  }

  return res.status(404).end()
}
