import React from 'react';
import {  useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home as HomeIcon, Add as AddIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Update as UpdateIcon, FormatListBulleted as AttendanceIcon } from '@mui/icons-material';

import { IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';


const AppBarStyled = styled(AppBar)`
  position: fixed;
  background-color: #2F4A62;
  top: 0;
`;

const AppTitle = styled(Typography)`
  flex-grow: 1;
  color: #fff;
`;

const NavButton = styled(Button)`
  color: white;
  text-decoration: none;
`;

const SideBar = styled(Drawer)`
  position: fixed;
  top: 0;
  left: 0;

  width: 240px;
  & .MuiDrawer-paper {
    width: 200px;
    background-color: #283B4C;
    color: #fff;
    margin-top: 64px;
  }
`;

const SideBarList = styled(List)`
  padding-top: 20px;

  & .MuiListItem-root {
    padding-top: 4px;
    padding-bottom: 4px;
  }
  
  & .MuiListItemIcon-root {
    min-width: 32px;
  }

  & .MuiListItemText-root {
    margin-left: 8px;
  }
`;
const NavBar = () => {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    // const handleDrawerClose = () => {
    //   setOpen(false);
    // };
  
    const NavIconButton = styled(IconButton)`
      margin-left: auto;
      color: #fff;
    `;
  
    const navigateToComponent = (path) => {
      navigate(path);
    };
  
    return (
      <>
        <AppBarStyled position="static">
          <Toolbar>
            <NavButton onClick={handleDrawerOpen}>
              <HomeIcon />
            </NavButton>
            <AppTitle variant="h6" component="div">
              LMS
            </AppTitle>
            <NavIconButton onClick={() => navigateToComponent('/')}>
              <Logout />
              Logout
            </NavIconButton>
          </Toolbar>
        </AppBarStyled>
        <SideBar variant="persistent" anchor="left" open={open}>
          <SideBarList>
            <ListItem button onClick={() => navigateToComponent('/homepage')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => navigateToComponent('/addmarks')}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Marks" />
            </ListItem>
            <ListItem button onClick={() => navigateToComponent('/deletemarks')}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Delete Marks" />
            </ListItem>
            <ListItem button onClick={() => navigateToComponent('/viewmarks')}>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary="View Marks" />
            </ListItem>
            <ListItem button onClick={() => navigateToComponent('/updatemarks')}>
              <ListItemIcon>
                <UpdateIcon />
              </ListItemIcon>
              <ListItemText primary="Update Marks" />
            </ListItem>
            <ListItem button onClick={() => navigateToComponent('/markattendance')}>
              <ListItemIcon>
                <AttendanceIcon />
              </ListItemIcon>
              <ListItemText primary="Mark Attendance" />
            </ListItem>
            <ListItem button onClick={() => navigateToComponent('/quiz')}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Make Quiz" />
            </ListItem>
          </SideBarList>
        </SideBar>
      </>
    );
  };

  export default NavBar;