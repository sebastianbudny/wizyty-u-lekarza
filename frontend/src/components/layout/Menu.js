import React, { useState } from 'react';
import { Box, Button, Menu as MuiMenu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Menu = () => {
  const navigate = useNavigate();
  const [doctorsAnchor, setDoctorsAnchor] = useState(null);
  const [visitsAnchor, setVisitsAnchor] = useState(null);

  const handleDoctorsMenu = (event) => {
    setDoctorsAnchor(event.currentTarget);
  };

  const handleVisitsMenu = (event) => {
    setVisitsAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setDoctorsAnchor(null);
    setVisitsAnchor(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <div>
        <Button
          color="inherit"
          onClick={handleDoctorsMenu}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Lekarze
        </Button>
        <MuiMenu
          anchorEl={doctorsAnchor}
          open={Boolean(doctorsAnchor)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { navigate('/doctors'); handleClose(); }}>
            Wyświetl wszystkich lekarzy
          </MenuItem>
          <MenuItem onClick={() => { navigate('/doctors/add'); handleClose(); }}>
            Dodaj lekarza
          </MenuItem>
          <MenuItem onClick={() => { navigate('/doctors/update'); handleClose(); }}>
            Zaktualizuj lekarza
          </MenuItem>
          <MenuItem onClick={() => { navigate('/doctors/delete'); handleClose(); }}>
            Usuń lekarza
          </MenuItem>
        </MuiMenu>
      </div>

      <div>
        <Button
          color="inherit"
          onClick={handleVisitsMenu}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Wizyty
        </Button>
        <MuiMenu
          anchorEl={visitsAnchor}
          open={Boolean(visitsAnchor)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { navigate('/visits/add'); handleClose(); }}>
            Dodaj wizytę
          </MenuItem>
          <MenuItem onClick={() => { navigate('/visits/update'); handleClose(); }}>
            Zaktualizuj wizytę
          </MenuItem>
          <MenuItem onClick={() => { navigate('/visits/delete'); handleClose(); }}>
            Usuń wizytę
          </MenuItem>
        </MuiMenu>
      </div>
    </Box>
  );
};

export default Menu;