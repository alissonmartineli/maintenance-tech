import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { FC } from 'react'

import DashboardIcon from '@mui/icons-material/Dashboard'
import QrCodeIcon from '@mui/icons-material/QrCode'
import EventNoteIcon from '@mui/icons-material/EventNote'
import { useRouter } from 'next/router'

const Menu: FC = () => {
  const router = useRouter()

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '280px',
        bgcolor: 'background.paper',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        <Box px={2} py={4}>
          <Typography variant="h5">Maintenance Tech</Typography>
        </Box>
        <nav aria-label="main">
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push('/app')}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Visão Geral" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push('/app/ativos')}>
                <ListItemIcon>
                  <QrCodeIcon />
                </ListItemIcon>
                <ListItemText primary="Ativos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => router.push('/app/ordens-de-servico')}
              >
                <ListItemIcon>
                  <EventNoteIcon />
                </ListItemIcon>
                <ListItemText primary="Ordens de Serviço" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
      </Box>
    </Box>
  )
}

export default Menu
