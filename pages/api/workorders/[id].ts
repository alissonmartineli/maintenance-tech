// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb'

type WorkOrderType = {
  _id?: string
  date: Date
  responsible: string
  type: string
  equipment: string
  description: string
  report: string
  done: boolean
}

type ErrorType = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WorkOrderType | ErrorType>
) {
  try {
    const id = req.query.id as string
    const { db } = await connectToDatabase()

    if (req.method === 'GET') {
      const workOrder = await db
        .collection('workOrders')
        .findOne({ _id: new ObjectId(id) })

      if (!workOrder) {
        return res.status(404).end()
      }

      return res.status(200).json(workOrder)
    } else if (req.method === 'PUT') {
      const workOrder = req.body as WorkOrderType

      const result = await db
        .collection('workOrders')
        .updateOne({ _id: new ObjectId(id) }, { $set: workOrder })

      result ? res.status(200).end() : res.status(500).end()
    } else if (req.method === 'DELETE') {
      const result = await db
        .collection('workOrders')
        .deleteOne({ _id: new ObjectId(id) })

      result ? res.status(200).end() : res.status(500).end()
    }
  } catch (error: any) {
    return res.status(400).send({ message: error.message })
  }

  return res.status(404).end()
}
