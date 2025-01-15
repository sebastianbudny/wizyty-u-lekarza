import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import Menu from './Menu.js';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          System Wizyt
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Menu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;