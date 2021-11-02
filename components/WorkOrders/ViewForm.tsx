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

interface IProps {
  workOrder?: WorkOrder
  open?: boolean
  onSave: (data: WorkOrder) => void
  onClose: () => void
}

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

const WorkOrderViewForm: FC<IProps> = ({
  workOrder: receivedWorkOrder,
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
  }, [receivedOpen])

  useEffect(() => {
    setWorkOrder(receivedWorkOrder || defaultValue)
    reset()
  }, [receivedWorkOrder])

  const onSubmit: SubmitHandler<WorkOrder> = async data => {
    if (workOrder._id) {
      await api.put<WorkOrder>(`/api/workorders/${workOrder._id}`, {
        done: !workOrder.done,
        report: data.report
      })
    }
    onSave({
      ...workOrder,
      done: !workOrder.done,
      report: data.report
    })
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>
        {workOrder.done
          ? 'Reabrir Ordem de Serviço'
          : 'Concluir Ordem de Serviço'}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="report"
                control={control}
                defaultValue={workOrder.report}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Relatório"
                    placeholder="Descreva os serviços efetuados"
                    disabled={workOrder.done}
                    fullWidth
                    {...field}
                    multiline
                    rows={4}
                    error={!!errors.report}
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
            {workOrder.done ? 'Reabir' : 'Concluir'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default WorkOrderViewForm
