import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 220;

function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  return (

    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth
        }
      }}
    >

      <List>
        <ListItemButton
          selected={location.pathname === "/"}
          onClick={() => navigate("/")}
        >
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          selected={location.pathname === "/new-job"}
          onClick={() => navigate("/new-job")}
        >
          <ListItemText primary="New Masking Job" />
        </ListItemButton>
      </List>

    </Drawer>

  );
}

export default Sidebar;