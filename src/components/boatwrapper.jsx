import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { useBoatDetail } from './boatdetail';
import { Box, Stack, Tab, Tabs, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import BoatButtons from './boatbuttons';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const drawerWidth = 240;

export function ResponsiveDrawer({ title, boat, panes }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selected, setSelected] = useState(0);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {panes.map((pane, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton  onClick={() => {setSelected(index); setMobileOpen(false)}}>
              <ListItemText primary={pane.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
          <BoatButtons boat={boat} />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="boat details"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
        <Toolbar />
    </Box>
            <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, marginLeft: '5px', paddingLeft: { sm: `${drawerWidth}px` }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {panes[selected].children}
      </Box>
    </Box>);
}

export function DetailTabs({ name, panes }) {
  const [value, setValue] = useState(0);
  const matches = useMediaQuery('(min-width:600px)');

  const orientation = matches ? 'horizontal' : 'vertical';
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{ flexGrow: 1, display: 'flex', height: '60vh' }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label={`detail tabs for ${name}`}
        orientation={orientation}
      >
        {panes.map((pane, i) => (<Tab key={i} label={pane.title} />))}
      </Tabs>
      {panes.map((pane, i) => (<TabPanel key={i} index={i} value={value} children={pane.children} />))}
    </Box>
  );
}

export default function BoatWrapper({ client, boat, location, lastModified }) {
  const panes = useBoatDetail(client, boat, location, lastModified);
  return (
    <Stack>
    <ResponsiveDrawer panes={panes} boat={boat} title={`${boat.name} (${boat.oga_no})`}/>
   </Stack>
  );
};
