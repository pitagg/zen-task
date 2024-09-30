import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header = ({ apiClient }) => {
  const handleLogout = () => {
    apiClient.logout();
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Left Side: App Name */}
        <Typography variant="h6" align='left' sx={{flexGrow: 1}}>ZenTask</Typography>

        {/* Right Side: User Name and Logout */}
        <Box display="flex" alignItems="center">
          <Typography variant="body2" component="span" sx={{ marginRight: 2, fontWeight: 300 }}>
            Logado como {apiClient.currentUser()}
          </Typography>
          <Button color="inherit" onClick={handleLogout} size='small'>
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
