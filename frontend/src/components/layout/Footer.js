import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, Box, Link 
} from '@mui/material';

const Footer = () => {
  const navigate = useNavigate();
  const [openContact, setOpenContact] = useState(false);

  const handleContactClick = () => {
    setOpenContact(true);
  };

  const handleCloseContact = () => {
    setOpenContact(false);
  };

  return (
    <AppBar 
      position="static" 
      color="primary" 
      className="footer"
    >
      <Toolbar 
        sx={{ 
          minHeight: '48px !important',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          '@media (min-width: 600px)': {
            minHeight: '48px !important',
          },
        }}
      >
        <Box />
        <Typography variant="body2" sx={{ gridColumn: '2' }}>
          Sebastian Budny &copy; {new Date().getFullYear()}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="inherit" onClick={handleContactClick}>
            Kontakt
          </Button>
        </Box>
      </Toolbar>

      <Dialog open={openContact} onClose={handleCloseContact}>
        <DialogTitle sx={{ textAlign: 'center' }}>Kontakt</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Email: <Link 
              href="mailto:sebastian.budny99@gmail.com" 
              color="primary"
            >
              sebastian.budny99@gmail.com
            </Link>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            LinkedIn: <Link 
              href="https://www.linkedin.com/in/sebastian-budny-b3a2282aa/" 
              target="_blank" 
              rel="noopener noreferrer"
              color="primary"
            >
              linkedin.com/in/sebastian-budny-b3a2282aa
            </Link>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            GitHub: <Link 
              href="https://github.com/SebastianBudny" 
              target="_blank" 
              rel="noopener noreferrer"
              color="primary"
            >
              github.com/SebastianBudny
            </Link>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleCloseContact} color="primary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Footer;