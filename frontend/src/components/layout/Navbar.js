import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Button, Typography } from '@mui/material';
import DropdownMenu from './DropdownMenu';
import UserService from '../../services/UserService';

const Navbar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const doctorMenuItems = [
    { label: 'Lista lekarzy', path: '/doctors' },
    { label: 'Dodaj lekarza', path: '/doctors/add' },
    { label: 'Zarządzaj lekarzami', path: '/doctors/manage' }
  ];

  const visitMenuItems = [
    { label: 'Dodaj wizytę', path: '/visits/add' },
    { label: 'Zarządzaj wizytami', path: '/visits/manage' }
  ];

  const adminMenuItems = [
    { label: 'Zarządzanie rejestratorami', path: '/registrars/manage' }
  ];

  const superAdminMenuItems = [
    { label: 'Zarządzanie wnioskami o uprawnienia Administratora', path: '/admin-requests/manage' },
    { label: 'Zarządzanie administratorami', path: '/admins/manage' }
  ];


  const handleLogout = () => {
    UserService.logout();
    navigate('/login');
  };

  const handleDashboardClick = () => {
    if (!user) return;
    
    switch (user.role) {
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
        {/* Left side - user actions */}
        {user && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={handleLogout}>
              Wyloguj
            </Button>
            <Button color="inherit" onClick={handleDashboardClick}>
              Pulpit
            </Button>
          </Box>
        )}

        {/* Center - title */}
        <Typography 
          variant="h6" 
          component="div"
          sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}
          className="navbar-title"
        >
          System zarządzania wizytami lekarskimi
        </Typography>

        {/* Right side - registrar menu */}
        {user?.role === 'registrar' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
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

        {user?.role === 'admin' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DropdownMenu 
              title="Rejestratorzy" 
              menuItems={adminMenuItems}
              isActive={activeMenu === 'registrars'}
              onActivate={() => setActiveMenu('registrars')}
              onClose={() => setActiveMenu(null)}
            />
          </Box>
        )}

        {user?.role === 'superadmin' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DropdownMenu 
              title="Administratorzy" 
              menuItems={superAdminMenuItems}
              isActive={activeMenu === 'admins'}
              onActivate={() => setActiveMenu('admins')}
              onClose={() => setActiveMenu(null)}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;