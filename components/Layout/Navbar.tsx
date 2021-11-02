import { FC } from 'react'
import { Box } from '@mui/system'
import { IconButton } from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'

interface IProps {
  onToggleMenu: () => void
}

const Navbar: FC<IProps> = ({ onToggleMenu }) => {
  return (
    <Box p={2}>
      <IconButton aria-label="menu" onClick={() => onToggleMenu()}>
        <MenuIcon />
      </IconButton>
    </Box>
  )
}

export default Navbar
