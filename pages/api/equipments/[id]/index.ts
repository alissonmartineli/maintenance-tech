// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../lib/mongodb'

type EquipmentType = {
  _id?: string
  code: string
  description: string
  manufacturer: string
  brand: string
  model: string
}

type ErrorType = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EquipmentType | ErrorType>
) {
  try {
    const id = req.query.id as string
    const { db } = await connectToDatabase()

    if (req.method === 'GET') {
      const equipment = await db
        .collection('equipments')
        .findOne({ _id: new ObjectId(id) })

      if (!equipment) {
        return res.status(404).end()
      }

      return res.status(200).json(equipment)
    } else if (req.method === 'PUT') {
      const equipment = req.body as EquipmentType

      const result = await db
        .collection('equipments')
        .updateOne({ _id: new ObjectId(id) }, { $set: equipment })

      result ? res.status(200).end() : res.status(500).end()
    } else if (req.method === 'DELETE') {
      const result = await db
        .collection('equipments')
        .deleteOne({ _id: new ObjectId(id) })

      result ? res.status(200).end() : res.status(500).end()
    }
  } catch (error: any) {
    return res.status(400).send({ message: error.message })
  }

  return res.status(404).end()
}
