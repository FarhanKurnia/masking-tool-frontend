import {
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            color: '#fff'
          }
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
            Data Masking Tool
          </Typography>
        </Box>
        <List>
          <ListItemButton onClick={() => navigate("/") }>
            <ListItemIcon sx={{ color: '#fff' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/new-job") }>
            <ListItemIcon sx={{ color: '#fff' }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New Masking Job" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: "#f5f6fa",
          minHeight: "100vh"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
