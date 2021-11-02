import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FC, useEffect, useState } from 'react'
import ptBR from 'dayjs/locale/pt-br'
import AdapterDayJs from '@mui/lab/AdapterDayjs'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import { api } from '../../services/api'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

type WorkOrder = {
  _id: string
  date: Date
  responsible: string
  type: string
  equipment: string
  description: string
  report: string
  done: boolean
}

type UserType = {
  _id: string
  name: string
  email: string
}

type EquipmentType = {
  _id: string
  code: string
  description: string
  manufacturer: string
  brand: string
  model: string
}

interface IProps {
  workOrder?: WorkOrder
  users: UserType[]
  equipments: EquipmentType[]
  open?: boolean
  onSave: (data: WorkOrder) => void
  onClose: () => void
}

const types = [
  { label: 'Corretiva', value: 'corrective' },
  { label: 'Preditiva', value: 'predictive' },
  { label: 'Preventiva ', value: 'preventive' }
]

const defaultValue = {
  _id: '',
  date: new Date(),
  responsible: '',
  type: '',
  equipment: '',
  description: '',
  report: '',
  done: false
}

const WorkOrderForm: FC<IProps> = ({
  workOrder: receivedWorkOrder,
  users,
  equipments,
  open: receivedOpen = false,
  onSave,
  onClose
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<WorkOrder>()

  const [workOrder, setWorkOrder] = useState<WorkOrder>(defaultValue)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(receivedOpen)
    if (!receivedOpen) {
      reset(defaultValue)
    }
  }, [receivedOpen])

  useEffect(() => {
    setWorkOrder(receivedWorkOrder || defaultValue)
    reset(receivedWorkOrder || defaultValue)
  }, [receivedWorkOrder])

  const onSubmit: SubmitHandler<WorkOrder> = async data => {
    if (workOrder._id) {
      await api.put<WorkOrder>(`/api/workorders/${workOrder._id}`, {
        date: data.date,
        responsible: data.responsible,
        type: data.type,
        equipment: data.equipment,
        description: data.description
      })
    } else {
      const response = await api.post<WorkOrder>('/api/workorders', {
        date: data.date,
        responsible: data.responsible,
        type: data.type,
        equipment: data.equipment,
        description: data.description,
        done: false
      })
      data._id = response.data._id
    }
    onSave({ ...workOrder, ...data })
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {workOrder._id
          ? 'Alterar Ordem de Serviço'
          : 'Adicionar Ordem de Serviço'}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="type"
                control={control}
                defaultValue={workOrder.type}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="type-select-label" error={!!errors.type}>
                      Tipo
                    </InputLabel>
                    <Select
                      label="Tipo"
                      labelId="type-select-label"
                      id="type-select"
                      {...field}
                      fullWidth
                      displayEmpty
                      MenuProps={MenuProps}
                      error={!!errors.type}
                    >
                      {types.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="date"
                control={control}
                defaultValue={workOrder.date}
                rules={{ required: true }}
                render={({ field }) => (
                  <LocalizationProvider
                    locale={ptBR}
                    dateAdapter={AdapterDayJs}
                  >
                    <DatePicker
                      label="Data"
                      {...field}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.date}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="equipment"
                control={control}
                defaultValue={workOrder.equipment}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel
                      id="equipment-select-label"
                      error={!!errors.equipment}
                    >
                      Equipamento
                    </InputLabel>
                    <Select
                      label="Equipamento"
                      labelId="equipment-select-label"
                      id="equipment-select"
                      {...field}
                      fullWidth
                      displayEmpty
                      MenuProps={MenuProps}
                      error={!!errors.equipment}
                    >
                      {equipments.map(equipment => (
                        <MenuItem key={equipment._id} value={equipment._id}>
                          {equipment.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="responsible"
                control={control}
                defaultValue={workOrder.responsible}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel
                      id="responsible-select-label"
                      error={!!errors.responsible}
                    >
                      Responsável
                    </InputLabel>
                    <Select
                      label="Responsável"
                      labelId="responsible-select-label"
                      id="responsible-select"
                      {...field}
                      fullWidth
                      displayEmpty
                      MenuProps={MenuProps}
                      error={!!errors.responsible}
                    >
                      {users.map(responsible => (
                        <MenuItem key={responsible._id} value={responsible._id}>
                          {responsible.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                defaultValue={workOrder.description}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Descrição"
                    placeholder="Descreva os serviços necessários"
                    fullWidth
                    {...field}
                    multiline
                    rows={4}
                    error={!!errors.description}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Stack direction="row" spacing={2} p={2}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Salvar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default WorkOrderForm
