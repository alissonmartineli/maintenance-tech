import { useState, FC, SyntheticEvent, MouseEvent, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Button, Fab, IconButton, Snackbar } from '@mui/material'
import EquipmentDialogForm from './DialogForm'

import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

type EquipmentType = {
  _id: string
  code: string
  description: string
  manufacturer: string
  brand: string
  model: string
}

interface IProps {
  onCreate: () => void
  open?: boolean
  onChange: (value: boolean) => void
}

const EquipmentCreateForm: FC<IProps> = ({
  onCreate,
  open: receivedOpen = false,
  onChange
}) => {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [notify, setNotify] = useState(false)
  const [id, setId] = useState('')

  useEffect(() => {
    setOpen(receivedOpen)
  }, [receivedOpen])

  const handleSave = (data: EquipmentType) => {
    setId(data._id)
    onChange(false)
    setNotify(true)
    onCreate()
  }

  const handleClose = () => {
    onChange(false)
  }

  const handleCloseNotify = (
    event: SyntheticEvent | MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setNotify(false)
  }

  const action = (
    <>
      <Button
        color="primary"
        size="small"
        onClick={() => router.push(`/app/equipamentos/${id}`)}
      >
        VER
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseNotify}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )

  return (
    <>
      <Fab
        onClick={() => onChange(true)}
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

      <EquipmentDialogForm
        open={open}
        onSave={data => handleSave(data)}
        onClose={() => handleClose()}
      />

      <Snackbar
        open={notify}
        autoHideDuration={6000}
        onClose={handleCloseNotify}
        message="Equipamento adicionado"
        action={action}
      />
    </>
  )
}

export default EquipmentCreateForm
