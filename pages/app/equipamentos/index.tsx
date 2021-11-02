import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Layout from '../../../components/Layout'
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import EquipmentCreateForm from '../../../components/Equipments/CreateForm'
import Loading from '../../../components/Common/Loading'
import { api } from '../../../services/api'

import LaunchIcon from '@mui/icons-material/Launch'

type EquipmentType = {
  _id: string
  code: string
  description: string
  manufacturer: string
  brand: string
  model: string
}

const EquipmentsPage: NextPage = () => {
  const router = useRouter()

  const [equipments, setEquipments] = useState<EquipmentType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    api.get<EquipmentType[]>('/api/equipments').then(({ data }) => {
      setEquipments(
        data.sort((a, b) => a.description.localeCompare(b.description, 'pt-BR'))
      )
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Layout>
      <Card>
        <CardContent>
          <Loading show={loading} />

          {!loading && !!equipments.length && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={180}>Código</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell align="center" width={180}>
                      Fabricante
                    </TableCell>
                    <TableCell align="center" width={180}>
                      Marca
                    </TableCell>
                    <TableCell align="center" width={180}>
                      Modelo
                    </TableCell>
                    <TableCell align="right" width={50}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipments.map(equipment => (
                    <TableRow
                      key={equipment._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{equipment.code}</TableCell>
                      <TableCell>{equipment.description}</TableCell>
                      <TableCell align="center">
                        {equipment.manufacturer}
                      </TableCell>
                      <TableCell align="center">{equipment.brand}</TableCell>
                      <TableCell align="center">{equipment.model}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() =>
                            router.push(`/app/equipamentos/${equipment._id}`)
                          }
                        >
                          <LaunchIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && !equipments.length && (
            <Stack alignItems="center" spacing={2}>
              <Image alt="Bot" src="/img/bot.png" width={160} height={160} />
              <Typography variant="h6">
                Você ainda não cadastrou equipamentos.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowForm(true)}
              >
                Cadastrar
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>

      <EquipmentCreateForm
        onCreate={load}
        open={showForm}
        onChange={value => setShowForm(value)}
      />
    </Layout>
  )
}

export default EquipmentsPage
