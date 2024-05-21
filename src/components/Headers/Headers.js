import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import finddubai from '../../Assests/finddubai.jpg';

const Headers = () => {
  return (
    <AppBar position="fixed" color="inherit" sx={{ zIndex: 1000 }}> 
      <Toolbar>
        <Link to="/" style={{ textDecoration: 'none', marginRight: 'auto' }}>
          <img src={finddubai} alt="FindDubai" style={{ width: '80px' }} /> 
        </Link>
        
        <Button component={Link} to="/" color="inherit">Home</Button>
        <Button component={Link} to="/about" color="inherit">About</Button>
        <Button component={Link} to="/contact" color="inherit">Contact</Button>
        
      </Toolbar>
    </AppBar>
  );
}

export default Headers;
