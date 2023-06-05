// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { styled } from '@mui/system';
// import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
// import { Home as HomeIcon, Add as AddIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Update as UpdateIcon, FormatListBulleted as AttendanceIcon } from '@mui/icons-material';
// import Quiz from './quiz.js';
// import AddMarksForm from '../src/Components/Marks/AddMarks.js';
// import UpdateMarks from './Components/Marks/UpdateMarks.js';
// import ViewMarksForm from './Components/Marks/ViewMarks.js';
// import DeleteMarks from './Components/Marks/DeleteMarks.js';
// import Attendance from './Components/Attendance/MarkAttendance.js';
// import { IconButton } from '@mui/material';
// import { Logout } from '@mui/icons-material';

// const AppBarStyled = styled(AppBar)`
//   background-color: #2F4A62;
// `;

// const AppTitle = styled(Typography)`
//   flex-grow: 1;
//   color: #fff;
// `;

// const NavButton = styled(Button)`
//   color: white;
//   text-decoration: none;
// `;

// const SideBar = styled(Drawer)`
//   width: 240px;
//   & .MuiDrawer-paper {
//     width: 200px;
//     background-color: #254664;
//     color: #fff;
//     margin-top: 64px;
//   }
// `;

// const SideBarList = styled(List)`
//   padding-top: 20px;

//   & .MuiListItem-root {
//     padding-top: 4px;
//     padding-bottom: 4px;
//   }
  
//   & .MuiListItemIcon-root {
//     min-width: 32px;
//   }

//   & .MuiListItemText-root {
//     margin-left: 8px;
//   }
// `;

// const NavBar = () => {
//   const [open, setOpen] = React.useState(true);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };
//   const LogoutButton = styled(IconButton)`
  
//   margin-left: auto;
//   color: #fff;
// `;

//   return (
//     <>
//       <AppBarStyled position="static">
//         <Toolbar>
//           <NavButton onClick={handleDrawerOpen}>
//             <HomeIcon />
//           </NavButton>
//           <AppTitle variant="h6" component="div">
//             LMS
//           </AppTitle>
//           <LogoutButton >
//             <Logout /> Logout
//           </LogoutButton>
//         </Toolbar>
//       </AppBarStyled>
//       <SideBar variant="persistent" anchor="left" open={open}>
//         <SideBarList>
//           {/* <ListItem button component={Link} to="/">
//             <ListItemIcon>
//               <HomeIcon />
//             </ListItemIcon>
//             <ListItemText primary="Home" />
//           </ListItem> */}
//           <ListItem button component={Link} to="/addmarks">
//             <ListItemIcon>
//               <AddIcon />
//             </ListItemIcon>
//             <ListItemText primary="Add Marks" />
//           </ListItem>
//           <ListItem button component={Link} to="/deletemarks">
//             <ListItemIcon>
//               <DeleteIcon />
//             </ListItemIcon>
//             <ListItemText primary="Delete Marks" />
//           </ListItem>
//           <ListItem button component={Link} to="/viewmarks">
//             <ListItemIcon>
//               <VisibilityIcon />
//             </ListItemIcon>
//             <ListItemText primary="View Marks" />
//           </ListItem>
//           <ListItem button component={Link} to="/updatemarks">
//             <ListItemIcon>
//               <UpdateIcon />
//             </ListItemIcon>
//             <ListItemText primary="Update Marks" />
//           </ListItem>
//           <ListItem button component={Link} to="/markattendance">
//             <ListItemIcon>
//               <AttendanceIcon />
//             </ListItemIcon>
//             <ListItemText primary="Mark Attendance" />
//           </ListItem>
//         </SideBarList>
//       </SideBar>
//     </>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <div>
//         <NavBar />
//         <Routes>
//           <Route path="/" element={<Quiz />} />
//           <Route path="/addmarks" element={<AddMarksForm />} />
//           <Route path="/deletemarks" element={<DeleteMarks />} />
//           <Route path="/viewmarks" element={<ViewMarksForm />} />
//           <Route path="/updatemarks" element={<UpdateMarks />} />
//           <Route path="/markattendance" element={<Attendance />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home as HomeIcon, Add as AddIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Update as UpdateIcon, FormatListBulleted as AttendanceIcon } from '@mui/icons-material';
import Quiz from './quiz.js';
import AddMarksForm from '../src/Components/Marks/AddMarks.js';
import UpdateMarks from './Components/Marks/UpdateMarks.js';
import ViewMarksForm from './Components/Marks/ViewMarks.js';
import DeleteMarks from './Components/Marks/DeleteMarks.js';
import Attendance from './Components/Attendance/MarkAttendance.js';
import { IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';

const AppBarStyled = styled(AppBar)`
  background-color: #2F4A62;
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
  width: 240px;
  & .MuiDrawer-paper {
    width: 200px;
    background-color: #254664;
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

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const NavIconButton = styled(IconButton)`
    margin-left: auto;
    color: #fff;
  `;

  const handleLogout = () => {
    // Perform logout logic here
  };

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
          <NavIconButton onClick={handleLogout}>
            <Logout />
            Logout
          </NavIconButton>
        </Toolbar>
      </AppBarStyled>
      <SideBar variant="persistent" anchor="left" open={open}>
        <SideBarList>
          <ListItem button onClick={() => navigateToComponent('/home')}>
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
        </SideBarList>
      </SideBar>
    </>
  );
};

const MainApp = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/home" element={<Quiz />} />
          <Route path="/addmarks" element={<AddMarksForm />} />
          <Route path="/deletemarks" element={<DeleteMarks />} />
          <Route path="/viewmarks" element={<ViewMarksForm />} />
          <Route path="/updatemarks" element={<UpdateMarks />} />
          <Route path="/markattendance" element={<Attendance />} />
        </Routes>
      </div>
    </Router>
  );
};

export default MainApp;
