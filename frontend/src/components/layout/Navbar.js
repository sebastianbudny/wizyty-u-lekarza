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
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side - user actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user && (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Wyloguj
              </Button>
              <Button color="inherit" onClick={handleDashboardClick}>
                Pulpit
              </Button>
            </>
          )}
        </Box>

        {/* Center - title */}
        <Typography 
          variant="h6" 
          component="div"
          className="navbar-title"
          sx={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)',
            fontWeight: 'bold'
          }}
        >
          System zarządzania wizytami lekarskimi
        </Typography>

        {/* Right side - role specific menus */}
        <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
          {user?.role === 'registrar' && (
            <>
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
            </>
          )}
          {user?.role === 'admin' && (
            <DropdownMenu 
              title="Rejestratorzy" 
              menuItems={adminMenuItems}
              isActive={activeMenu === 'registrars'}
              onActivate={() => setActiveMenu('registrars')}
              onClose={() => setActiveMenu(null)}
            />
          )}
          {user?.role === 'superadmin' && (
            <DropdownMenu 
              title="Administratorzy" 
              menuItems={superAdminMenuItems}
              isActive={activeMenu === 'admins'}
              onActivate={() => setActiveMenu('admins')}
              onClose={() => setActiveMenu(null)}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;