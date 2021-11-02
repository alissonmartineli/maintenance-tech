import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography
} from '@mui/material'
import type { NextPage } from 'next'
import Layout from '../../components/Layout'
import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import Loading from '../../components/Common/Loading'
import dayjs from 'dayjs'

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import AssignmentIcon from '@mui/icons-material/Assignment'

type WorkOrderResponse = {
  _id: string
  date: Date
  responsible: string
  type: string
  equipment: string
  description: string
  report: string
  done: boolean
}

const HomePage: NextPage = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrderResponse[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<WorkOrderResponse[]>('/api/workorders').then(({ data }) => {
      setWorkOrders(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Layout>
      {loading ? (
        <Card>
          <CardContent>
            <Loading show={loading} />
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                action={<AssignmentIcon color="info" />}
                title="OSs em Processo"
              />
              <Divider />
              <CardContent>
                <Typography variant="h4">
                  {workOrders.filter(workOrder => !workOrder.done).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                action={<AssignmentTurnedInIcon color="success" />}
                title="OSs Finalizadas"
              />
              <Divider />
              <CardContent>
                <Typography variant="h4">
                  {workOrders.filter(workOrder => workOrder.done).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                action={<AssignmentLateIcon color="error" />}
                title="OSs em Atraso"
              />
              <Divider />
              <CardContent>
                <Typography variant="h4">
                  {
                    workOrders.filter(
                      workOrder =>
                        !workOrder.done &&
                        dayjs(workOrder.date).isBefore(dayjs(), 'day')
                    ).length
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

export default HomePage
