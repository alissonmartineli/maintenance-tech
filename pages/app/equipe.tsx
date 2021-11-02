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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import UsersForm from '../../components/Users/Form'
import Loading from '../../components/Common/Loading'
import { api } from '../../services/api'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

type UserType = {
  _id: string
  name: string
  email: string
}

const UsersPage: NextPage = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [selected, setSelected] = useState<UserType | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const load = () => {
    setLoading(true)
    api.get<UserType[]>('/api/users').then(({ data }) => {
      setUsers(data.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')))
      setLoading(false)
    })
  }

  const remove = () => {
    if (selected) {
      api.delete(`/api/users/${selected._id}`)
      setUsers(users.filter(user => user._id !== selected._id))
      setShowDeleteConfirmation(false)
    }
  }

  const openDeleteConfirmation = (user: UserType) => {
    setSelected(user)
    setShowDeleteConfirmation(true)
  }

  const openForm = (user?: UserType) => {
    setSelected(user)
    setShowForm(true)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Layout>
      <Card>
        <CardContent>
          <Loading show={loading} />

          {!loading && !!users.length && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="50%">Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right" width={100}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(person => (
                    <TableRow
                      key={person._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{person.name}</TableCell>
                      <TableCell>{person.email}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => openForm(person)}
                        >
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={() => openDeleteConfirmation(person)}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && !users.length && (
            <Stack alignItems="center" spacing={2}>
              <Image alt="Bot" src="/img/bot.png" width={160} height={160} />
              <Typography variant="h6">
                Você ainda não cadastrou ninguém.
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

      <UsersForm
        user={selected}
        open={showForm}
        onSave={savedUser => {
          if (!selected) {
            setUsers(
              [...users, savedUser].sort((a, b) =>
                a.name.localeCompare(b.name, 'pt-BR')
              )
            )
          } else {
            setUsers(
              [
                ...users.map(user => {
                  if (user._id === savedUser._id) {
                    return { ...user, ...savedUser }
                  }
                  return user
                })
              ].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
            )
          }
          setShowForm(false)
        }}
        onClose={() => setShowForm(false)}
      />

      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Remover Colaborador</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza de que deseja remover o colaborador?
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
    </Layout>
  )
}

export default UsersPage
