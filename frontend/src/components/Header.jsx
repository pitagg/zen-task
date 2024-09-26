import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ApiClient from '../utils/ApiClient';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    ApiClient.logout();
    navigate("/login");
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Left Side: App Name */}
        <Typography variant="h6" component={RouterLink} to="/projects"
          align='left' sx={{
            flexGrow: 1, textDecoration: 'none', color: 'inherit'
          }
        }>
          ZenTask
        </Typography>

        {/* Right Side: User Name and Logout */}
        <Box display="flex" alignItems="center">
          <Typography variant="body2" component="span" sx={{ marginRight: 2, fontWeight: 300 }}>
            Logado como {ApiClient.currentUser()}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
