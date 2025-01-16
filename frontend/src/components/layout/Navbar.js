import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Button } from '@mui/material';
import DropdownMenu from './DropdownMenu';
import UserService from '../../services/UserService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeMenu, setActiveMenu] = useState(null);

  const doctorMenuItems = [
    { label: 'Wyświetl wszystkich lekarzy', path: '/doctors' },
    { label: 'Dodaj lekarza', path: '/doctors/add' },
    { label: 'Zaktualizuj lekarza', path: '/doctors/update' },
    { label: 'Usuń lekarza', path: '/doctors/delete' }
  ];

  const visitMenuItems = [
    { label: 'Dodaj wizytę', path: '/visits/add' },
    { label: 'Zaktualizuj wizytę', path: '/visits/update' },
    { label: 'Usuń wizytę', path: '/visits/delete' }
  ];

  const handleLogout = () => {
    UserService.logout();
    navigate('/login');
  };

  const handleDashboardClick = () => {
    switch (user?.role) {
      case 'registrar':
        navigate('/registrar-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'superadmin':
        navigate('/superadmin-dashboard');
        break;
      default:
        navigate('/login');
    }
  };

  return (
    <AppBar position="static">
    <Toolbar>
      {/* Left side buttons */}
      {user && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={handleLogout}
          >
            Wyloguj
          </Button>
          <Button
            color="inherit"
            onClick={handleDashboardClick}
          >
            Pulpit
          </Button>
        </Box>
      )}

      {/* Right side menu items */}
      {user?.role === 'registrar' && (
        <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
          <DropdownMenu 
            title="Lekarze" 
            menuItems={doctorMenuItems} 
            isActive={activeMenu === 'doctors'}
            onActivate={() => setActiveMenu('doctors')}
            onClose={() => setActiveMenu(null)}
          />
          <DropdownMenu 
            title="Wizyty" 
            menuItems={visitMenuItems} 
            isActive={activeMenu === 'visits'}
            onActivate={() => setActiveMenu('visits')}
            onClose={() => setActiveMenu(null)}
          />
        </Box>
      )}
    </Toolbar>
  </AppBar>
  );
};

export default Navbar;