import { FC } from 'react'
import { useRouter } from 'next/router'
import {
  Divider,
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Slide,
  Typography
} from '@mui/material'
import { Box, styled } from '@mui/system'

import DashboardIcon from '@mui/icons-material/Dashboard'
import QrCodeIcon from '@mui/icons-material/QrCode'
import EventNoteIcon from '@mui/icons-material/EventNote'
import PeopleIcon from '@mui/icons-material/People'

interface IProps {
  show: boolean
  onClose: () => void
}

const Root = styled('div')(({ theme }) => ({
  width: '100vw',
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 10,
  height: '100vh',
  overflowY: 'auto',
  position: 'absolute',
  [theme.breakpoints.up('sm')]: {
    display: 'none'
  }
}))

const Cointainer = styled(Paper)(({ theme }) => ({
  width: '80vw',
  maxWidth: '280px',
  backgroundColor: 'white',
  height: '100vh',
  zIndex: 20,
  [theme.breakpoints.down('md')]: {
    position: 'absolute'
  },
  [theme.breakpoints.up('sm')]: {
    position: 'relative'
  }
}))

const Menu: FC<IProps> = ({ show, onClose }) => {
  const router = useRouter()

  return (
    <>
      <Fade in={show}>
        <Root
          onClick={event => {
            onClose()
            event.preventDefault()
          }}
        />
      </Fade>

      <Slide direction="right" in={show} mountOnEnter unmountOnExit>
        <Cointainer
          square
          elevation={4}
          onClick={event => event.preventDefault()}
        >
          <Box px={2} py={2}>
            <Typography variant="h5" fontWeight="bold">
              Maintenance Tech
            </Typography>
          </Box>
          <Divider />
          <nav aria-label="main">
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push('/app')}
                  selected={router.pathname === '/app'}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Visão Geral" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push('/app/ordens-de-servico')}
                  selected={router.pathname === '/app/ordens-de-servico'}
                >
                  <ListItemIcon>
                    <EventNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Ordens de Serviço" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push('/app/equipamentos')}
                  selected={router.pathname === '/app/equipamentos'}
                >
                  <ListItemIcon>
                    <QrCodeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Equipamentos" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push('/app/equipe')}
                  selected={router.pathname === '/app/equipe'}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Equipe" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Cointainer>
      </Slide>
    </>
  )
}

export default Menu
