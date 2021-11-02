import { Container, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { FC, useState } from 'react'
import Menu from './Menu'
import Navbar from './Navbar'

const Layout: FC = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <Stack direction="row" sx={{ bgcolor: '#FAFBFB' }}>
      <Menu show={showMenu} onClose={() => setShowMenu(false)} />

      <Box mb={4} sx={{ flex: 1, minHeight: '100vh' }}>
        <Navbar onToggleMenu={() => setShowMenu(!showMenu)} />
        <Container>{children}</Container>
      </Box>
    </Stack>
  )
}

export default Layout
