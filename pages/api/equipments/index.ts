// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb'

type EquipmentType = {
  _id: string
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
  res: NextApiResponse<EquipmentType | EquipmentType[] | ErrorType>
) {
  try {
    const { db } = await connectToDatabase()
    if (req.method === 'GET') {
      const equipments = await db.collection('equipments').find({}).toArray()

      return res.status(200).json(equipments)
    } else if (req.method === 'POST') {
      const equipment = req.body as EquipmentType

      const result = await db.collection('equipments').insertOne(equipment)

      result
        ? res.status(201).json({ ...equipment, _id: result.insertedId })
        : res.status(500).end()
    }
  } catch (error: any) {
    return res.status(400).send({ message: error.message })
  }

  return res.status(404).end()
}
