import React, { useState } from 'react';
import { Menu, MenuItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const DropdownMenu = ({ title, menuItems }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleClick = (path) => {
    navigate(path);
    setAnchorEl(null);
  };

  return (
    <div onMouseLeave={handleMouseLeave}>
      <Button
        color="inherit"
        onMouseEnter={handleMouseEnter}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        {title}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          onMouseLeave: handleMouseLeave
        }}
        sx={{
          '& .MuiPaper-root': {
            marginTop: '8px',
            minWidth: '200px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => handleClick(item.path)}
            sx={{
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DropdownMenu;