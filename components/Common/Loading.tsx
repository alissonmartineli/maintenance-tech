import { CircularProgress, Stack, Typography } from '@mui/material'
import { useEffect, useState, FC } from 'react'

interface IProps {
  show: boolean
}

const Loading: FC<IProps> = ({ show: receivedShow }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(receivedShow)
  }, [receivedShow])

  if (!show) {
    return null
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <CircularProgress />
      <Typography variant="h6">Carregando...</Typography>
    </Stack>
  )
}

export default Loading
