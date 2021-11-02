import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FC, useEffect, useState } from 'react'
import { api } from '../../services/api'
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

type UserType = {
  _id: string
  name: string
  email: string
}

interface IProps {
  user?: UserType
  open?: boolean
  onSave: (data: UserType) => void
  onClose: () => void
}

const defaultValue = {
  _id: '',
  name: '',
  email: ''
}

const PersonForm: FC<IProps> = ({
  user: receivedUser,
  open: receivedOpen = false,
  onSave,
  onClose
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserType>()

  const [user, setUser] = useState<UserType>(defaultValue)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(receivedOpen)
    if (!receivedOpen) {
      reset(defaultValue)
    }
  }, [receivedOpen])

  useEffect(() => {
    setUser(receivedUser || defaultValue)
    reset(receivedUser || defaultValue)
  }, [receivedUser])

  const onSubmit: SubmitHandler<UserType> = async data => {
    if (user._id) {
      await api.put<UserType>(`/api/users/${user._id}`, {
        email: data.email,
        name: data.name
      })
    } else {
      const response = await api.post<UserType>('/api/users', {
        email: data.email,
        name: data.name
      })
      data._id = response.data._id
    }
    onSave({ ...user, ...data } as UserType)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {user._id ? 'Alterar Colaborador' : 'Adicionar Colaborador'}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                defaultValue={user.name}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Nome"
                    fullWidth
                    {...field}
                    error={!!errors.name}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue={user.email}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Email"
                    fullWidth
                    {...field}
                    error={!!errors.email}
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

export default PersonForm
