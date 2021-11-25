import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import Loading from '../../../components/Common/Loading'
import Layout from '../../../components/Layout'
import { api } from '../../../services/api'
import EquipmentDialogForm from '../../../components/Equipments/DialogForm'
import axios from 'axios'
import dayjs from 'dayjs'

import QrCodeIcon from '@mui/icons-material/QrCode'
import BusinessIcon from '@mui/icons-material/Business'
import ShieldIcon from '@mui/icons-material/Shield'
import LabelIcon from '@mui/icons-material/Label'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import EventIcon from '@mui/icons-material/Event'
import PersonIcon from '@mui/icons-material/Person'
import CategoryIcon from '@mui/icons-material/Category'
import DescriptionIcon from '@mui/icons-material/Description'

type EquipmentType = {
  _id: string
  code: string
  description: string
  manufacturer: string
  brand: string
  model: string
}

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
  { label: 'Preventiva ', value: 'preventive', color: 'success' }
]

const parseResponseToWorkOrder = (
  workOrder: WorkOrderResponse,
  users: UserType[],
  equipment: EquipmentType
): WorkOrder => {
  return {
    ...workOrder,
    responsible: users.find(user => user._id === workOrder.responsible),
    equipment: equipment,
    type: types.find(type => type.value === workOrder.type)
  } as WorkOrder
}

const EquipmentViewPage: NextPage = () => {
  const router = useRouter()

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [equipment, setEquipment] = useState<EquipmentType | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  useEffect(() => {
    const { id } = router.query
    if (id) {
      axios
        .all([
          api.get(`/api/equipments/${id}/workorders`),
          api.get('/api/users'),
          api.get<EquipmentType>(`/api/equipments/${id}`)
        ])
        .then(([{ data: resp1 }, { data: resp2 }, { data: resp3 }]) => {
          const workOrders = resp1 as WorkOrderResponse[]
          const users = resp2 as UserType[]
          const equipment = resp3 as EquipmentType

          setWorkOrders(
            workOrders
              .map(workOrder =>
                parseResponseToWorkOrder(workOrder, users, equipment)
              )
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              ) as WorkOrder[]
          )
          setEquipment(equipment)
          setLoading(false)
        })
    }
  }, [router])

  const remove = () => {
    const { id } = router.query
    if (id) {
      router.push('/app/equipamentos')
      api.delete(`/api/equipments/${id}`)
    }
  }

  return (
    <Layout>
      {loading && (
        <Card>
          <CardContent>
            <Loading show={loading} />
          </CardContent>
        </Card>
      )}

      {!loading && equipment && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  action={
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => setShowDeleteConfirmation(true)}
                      >
                        <DeleteIcon />
                      </IconButton>

                      <IconButton
                        aria-label="edit"
                        onClick={() => setShowForm(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Stack>
                  }
                  title={equipment.description}
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ position: 'relative', height: '100%' }}>
                        <Image
                          alt="Mountains"
                          src="/img/default.png"
                          layout="fill"
                          objectFit="none"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <QrCodeIcon />
                          </ListItemIcon>
                          <ListItemText>
                            <b>Código:</b> {equipment.code}
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <BusinessIcon />
                          </ListItemIcon>
                          <ListItemText>
                            <b>Fabricante:</b> {equipment.manufacturer}
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <ShieldIcon />
                          </ListItemIcon>
                          <ListItemText>
                            <b>Marca:</b> {equipment.brand}
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LabelIcon />
                          </ListItemIcon>
                          <ListItemText>
                            <b>Modelo:</b> {equipment.model}
                          </ListItemText>
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Histórico" />
                <Divider />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemText>
                        <b>Tempo ligado:</b> 146 h
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <b>Tempo parado:</b> 10 h
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <b>Em operação:</b> 93% do tempo
                      </ListItemText>
                    </ListItem>
                  </List>

                  <Box px={2}>
                    <Typography variant="caption">
                      nos últimos 7 dias
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  action={
                    <IconButton aria-label="add">
                      <AddIcon />
                    </IconButton>
                  }
                  title="Ordens de Serviço"
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    {workOrders.map(workOrder => (
                      <Grid key={workOrder._id} item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardHeader
                            action={
                              <IconButton aria-label="edit">
                                <EditIcon />
                              </IconButton>
                            }
                            title={
                              <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical'
                                }}
                              >
                                {workOrder.description}
                              </Typography>
                            }
                          />
                          <Divider />
                          <CardContent>
                            <List dense>
                              <ListItem>
                                <ListItemIcon>
                                  <EventIcon />
                                </ListItemIcon>
                                <ListItemText>
                                  <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                  >
                                    <Typography
                                      variant="inherit"
                                      fontWeight="bold"
                                    >
                                      Data:
                                    </Typography>
                                    <Typography variant="inherit">
                                      {dayjs(workOrder.date).format(
                                        'DD/MM/YYYY'
                                      )}
                                    </Typography>
                                    {workOrder.done && (
                                      <AssignmentTurnedInIcon color="success" />
                                    )}
                                    {!workOrder.done &&
                                      !dayjs(workOrder.date).isAfter(
                                        dayjs(),
                                        'day'
                                      ) && (
                                        <AssignmentLateIcon
                                          color={
                                            dayjs().isSame(
                                              workOrder.date,
                                              'day'
                                            )
                                              ? 'warning'
                                              : 'error'
                                          }
                                        />
                                      )}
                                  </Stack>
                                </ListItemText>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <CategoryIcon />
                                </ListItemIcon>
                                <ListItemText>
                                  <b>Tipo:</b>{' '}
                                  <Chip
                                    label={workOrder.type.label}
                                    color={workOrder.type.color}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      fontWeight: 'bold'
                                    }}
                                  />
                                </ListItemText>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <PersonIcon />
                                </ListItemIcon>
                                <ListItemText>
                                  <b>Responsável:</b>{' '}
                                  {workOrder.responsible.name}
                                </ListItemText>
                              </ListItem>
                              <ListItem sx={{ alignItems: 'flex-start' }}>
                                <ListItemIcon>
                                  <DescriptionIcon />
                                </ListItemIcon>
                                <ListItemText>
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 3,
                                      WebkitBoxOrient: 'vertical'
                                    }}
                                  >
                                    <b>Descrição:</b> {workOrder.description}
                                  </Typography>
                                </ListItemText>
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Dialog
            open={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              Remover Equipamento
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                Tem certeza de que deseja remover o equipamento?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteConfirmation(false)}>
                Cancelar
              </Button>
              <Button color="error" onClick={() => remove()} autoFocus>
                Remover
              </Button>
            </DialogActions>
          </Dialog>

          <EquipmentDialogForm
            equipment={equipment}
            open={showForm}
            onSave={data => setEquipment(data)}
            onClose={() => setShowForm(false)}
          />
        </>
      )}
    </Layout>
  )
}

export default EquipmentViewPage
