// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../lib/mongodb'

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
  res: NextApiResponse<WorkOrderType | WorkOrderType[] | ErrorType>
) {
  try {
    const id = req.query.id as string
    const { db } = await connectToDatabase()

    if (req.method === 'GET') {
      const workOrders = await db
        .collection('workOrders')
        .find({ equipment: id })
        .toArray()

      return res.status(200).json(workOrders)
    }
  } catch (error: any) {
    return res.status(400).send({ message: error.message })
  }

  return res.status(404).end()
}
