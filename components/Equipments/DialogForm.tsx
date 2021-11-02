import { useState, FC, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField
} from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { api } from '../../services/api'

type EquipmentType = {
  _id: string
  code: string
  description: string
  manufacturer: string
  brand: string
  model: string
}

interface IProps {
  equipment?: EquipmentType
  open?: boolean
  onSave: (data: EquipmentType) => void
  onClose: () => void
}

const EquipmentDialogForm: FC<IProps> = ({
  equipment = {},
  open: receivedOpen = false,
  onSave,
  onClose
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EquipmentType>()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(receivedOpen)
    if (!receivedOpen) {
      reset()
    }
  }, [receivedOpen])

  const onSubmit: SubmitHandler<EquipmentType> = async data => {
    if (equipment._id) {
      await api.put<EquipmentType>(`/api/equipments/${equipment._id}`, data)
    } else {
      const response = await api.post<EquipmentType>('/api/equipments', data)
      data._id = response.data._id
    }
    onClose()
    onSave(data as EquipmentType)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {equipment._id ? 'Alterar Equipamento' : 'Adicionar Equipamento'}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="code"
                control={control}
                defaultValue={equipment.code}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Código"
                    fullWidth
                    {...field}
                    error={!!errors.code}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                defaultValue={equipment.description}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Descrição"
                    fullWidth
                    {...field}
                    error={!!errors.description}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="manufacturer"
                control={control}
                defaultValue={equipment.manufacturer}
                render={({ field }) => (
                  <TextField
                    label="Fabricante"
                    fullWidth
                    {...field}
                    error={!!errors.manufacturer}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="brand"
                control={control}
                defaultValue={equipment.brand}
                render={({ field }) => (
                  <TextField
                    label="Marca"
                    fullWidth
                    {...field}
                    error={!!errors.brand}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="model"
                control={control}
                defaultValue={equipment.model}
                render={({ field }) => (
                  <TextField
                    label="Modelo"
                    fullWidth
                    {...field}
                    error={!!errors.model}
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

export default EquipmentDialogForm
