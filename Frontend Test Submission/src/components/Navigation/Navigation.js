import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';
import { Log } from '../../utils/logger';

const Navigation = () => {
  const location = useLocation();

  const handleNavClick = (page) => {
    Log('frontend', 'info', 'component', `navigating to ${page} page`);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <LinkIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/shortener"
            onClick={() => handleNavClick('shortener')}
            sx={{ 
              backgroundColor: location.pathname === '/shortener' ? 'rgba(255,255,255,0.1)' : 'transparent' 
            }}
          >
            Create Short URL
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/statistics"
            onClick={() => handleNavClick('statistics')}
            sx={{ 
              backgroundColor: location.pathname === '/statistics' ? 'rgba(255,255,255,0.1)' : 'transparent' 
            }}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
