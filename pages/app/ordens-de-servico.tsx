import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Layout from '../../components/Layout'
import {
  Button,
  Card,
  CardContent,
  Chip,
  Fab,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import dayjs from 'dayjs'
import WorkOrdersForm from '../../components/WorkOrders/Form'
import WorkOrdersViewForm from '../../components/WorkOrders/ViewForm'
import Loading from '../../components/Common/Loading'
import { api } from '../../services/api'
import axios from 'axios'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DoneIcon from '@mui/icons-material/Done'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import AssignmentIcon from '@mui/icons-material/Assignment'
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'

type UserType = {
  _id: string
  name: string
  email: string
}

type Type = {
  label: string
  value: string
  color: 'error' | 'info' | 'success'
}

type EquipmentType = {
  _id: string
  code: string
  description: string
  manufacturer: string
  brand: string
  model: string
}

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

type WorkOrder = {
  _id: string
  date: Date
  responsible: UserType
  type: Type
  equipment: EquipmentType
  description: string
  report: string
  done: boolean
}

const types = [
  { label: 'Corretiva', value: 'corrective', color: 'error' },
  { label: 'Preditiva', value: 'predictive', color: 'info' },
  { label: 'Preventiva ', value: 'preventiva', color: 'success' }
]

const parseResponseToWorkOrder = (
  workOrder: WorkOrderResponse,
  users: UserType[],
  equipments: EquipmentType[]
): WorkOrder => {
  return {
    ...workOrder,
    responsible: users.find(user => user._id === workOrder.responsible),
    equipment: equipments.find(
      equipment => equipment._id === workOrder.equipment
    ),
    type: types.find(type => type.value === workOrder.type)
  } as WorkOrder
}

const parseWorkOrderToResponse = (workOrder: WorkOrder): WorkOrderResponse => {
  return {
    ...workOrder,
    responsible: workOrder?.responsible._id,
    equipment: workOrder?.equipment._id,
    type: workOrder?.type.value
  } as WorkOrderResponse
}

const WorkOrdersPage: NextPage = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [equipments, setEquipments] = useState<EquipmentType[]>([])
  const [selected, setSelected] = useState<WorkOrderResponse | undefined>(
    undefined
  )
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showViewForm, setShowViewForm] = useState(false)

  const load = () => {
    setLoading(true)

    axios
      .all([
        api.get('/api/workorders'),
        api.get('/api/users'),
        api.get('/api/equipments')
      ])
      .then(([{ data: resp1 }, { data: resp2 }, { data: resp3 }]) => {
        const workOrders = resp1 as WorkOrderResponse[]
        const users = resp2 as UserType[]
        const equipments = resp3 as EquipmentType[]

        setWorkOrders(
          workOrders
            .map(workOrder =>
              parseResponseToWorkOrder(workOrder, users, equipments)
            )
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            ) as WorkOrder[]
        )
        setUsers(users)
        setEquipments(equipments)
        setLoading(false)
      })
  }

  const reload = (savedWorkOrder: WorkOrderResponse) => {
    if (!selected) {
      setWorkOrders(
        [
          ...workOrders,
          parseResponseToWorkOrder(savedWorkOrder, users, equipments)
        ].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      )
    } else {
      setWorkOrders(
        [
          ...workOrders.map(workOrder => {
            if (workOrder._id === savedWorkOrder._id) {
              return {
                ...workOrder,
                ...parseResponseToWorkOrder(savedWorkOrder, users, equipments)
              }
            }
            return workOrder
          })
        ].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      )
    }
  }

  const openForm = (workOrder?: WorkOrder) => {
    if (workOrder) {
      setSelected(parseWorkOrderToResponse(workOrder))
    } else {
      setSelected(undefined)
    }
    setShowForm(true)
  }

  const openViewForm = (workOrder: WorkOrder) => {
    setSelected({
      ...workOrder,
      responsible: workOrder?.responsible._id,
      equipment: workOrder?.equipment._id,
      type: workOrder?.type.value
    } as WorkOrderResponse)

    setShowViewForm(true)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Layout>
      <Card>
        <CardContent>
          <Loading show={loading} />

          {!loading && !!workOrders.length && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={150}>Data</TableCell>
                    <TableCell width={100}>Tipo</TableCell>
                    <TableCell>Equipamento</TableCell>
                    <TableCell width={280}>Responsável</TableCell>
                    <TableCell align="right" width={100}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workOrders.map(workOrder => (
                    <TableRow
                      key={workOrder._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {workOrder.done ? (
                            <AssignmentTurnedInIcon color="success" />
                          ) : !dayjs(workOrder.date).isAfter(dayjs(), 'day') ? (
                            <AssignmentLateIcon
                              color={
                                dayjs().isSame(workOrder.date, 'day')
                                  ? 'warning'
                                  : 'error'
                              }
                            />
                          ) : (
                            <AssignmentIcon color="disabled" />
                          )}
                          <Typography
                            variant="inherit"
                            color={workOrder.done ? 'text.disabled' : 'inherit'}
                          >
                            {dayjs(workOrder.date).format('DD/MM/YYYY')}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={workOrder.type.label}
                          color={workOrder.type.color}
                          size="small"
                          variant="outlined"
                          disabled={workOrder.done}
                          sx={{
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="inherit"
                          color={workOrder.done ? 'text.disabled' : 'inherit'}
                        >
                          {workOrder.equipment.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="inherit"
                          color={workOrder.done ? 'text.disabled' : 'inherit'}
                        >
                          {workOrder.responsible.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => openForm(workOrder)}
                          disabled={workOrder.done}
                        >
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          aria-label="close"
                          size="small"
                          onClick={() => openViewForm(workOrder)}
                        >
                          {workOrder.done ? (
                            <RemoveDoneIcon fontSize="inherit" />
                          ) : (
                            <DoneIcon fontSize="inherit" />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && !workOrders.length && (
            <Stack alignItems="center" spacing={2}>
              <Image alt="Bot" src="/img/bot.png" width={160} height={160} />
              <Typography variant="h6">
                Você ainda não cadastrou ordens de serviço.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => openForm()}
              >
                Cadastrar
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Fab
        onClick={() => openForm()}
        color="primary"
        aria-label="add"
        sx={{
          position: 'absolute',
          bottom: 32,
          right: 32
        }}
      >
        <AddIcon />
      </Fab>

      <WorkOrdersForm
        workOrder={selected}
        users={users}
        equipments={equipments}
        open={showForm}
        onSave={savedWorkOrder => {
          reload(savedWorkOrder)
          setShowForm(false)
        }}
        onClose={() => setShowForm(false)}
      />

      <WorkOrdersViewForm
        workOrder={selected}
        open={showViewForm}
        onSave={savedWorkOrder => {
          reload(savedWorkOrder)
          setShowViewForm(false)
        }}
        onClose={() => setShowViewForm(false)}
      />
    </Layout>
  )
}

export default WorkOrdersPage
