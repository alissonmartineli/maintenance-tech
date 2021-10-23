import { FC } from 'react'
import { Box } from '@mui/system'
import { IconButton } from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'

const Navbar: FC = () => {
  return (
    <Box p={2}>
      <IconButton aria-label="menu">
        <MenuIcon />
      </IconButton>
    </Box>
  )
}

export default Navbar
