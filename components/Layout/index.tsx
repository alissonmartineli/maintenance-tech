import { Container, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { FC } from 'react'
import Menu from './Menu'
import Navbar from './Navbar'

const Layout: FC = ({ children }) => {
  return (
    <Stack direction="row">
      <Menu />

      <Box sx={{ flex: 1, bgcolor: '#FAFBFB', minHeight: '100vh' }}>
        <Navbar />
        <Container>
          <Box p={2}>{children}</Box>
        </Container>
      </Box>
    </Stack>
  )
}

export default Layout
