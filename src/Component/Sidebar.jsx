import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SidebarHeader } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import logo from "../assets/logo/logo.png";
import "../Component/sidebar.css";
import ComplaintIcon from "@mui/icons-material/Report";
import StatsIcon from "@mui/icons-material/BarChart";
import UsersIcon from "@mui/icons-material/People";
import DriversIcon from "@mui/icons-material/DriveEta";
import BusesIcon from "@mui/icons-material/DirectionsBus";
import ArchiveIcon from "@mui/icons-material/Archive";
import TripsIcon from "@mui/icons-material/Directions";
import RequestsIcon from "@mui/icons-material/PlaylistAddCheck";
import KitchenIcon from "@mui/icons-material/Kitchen";
import { Button } from "@mui/material";
import { localStorageServices } from "../api/tokenService";
import { logout } from "../api/authApi";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    height: "93vh",
    borderLeft: "24px solid #282828",
    borderRadius: "10px",
    background: "#282828",
    zIndex: "999",
  },

  sidebarHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    marginTop: "10px",
    marginBottom: "30px",
    marginLeft: "40px",
  },
  logo: {
    width: "90%",
    maxHeight: "100%",
  },
  Typography: {
    color: "antiquewhite",
    fontSize: "18px",
  },
  active: {
    background: "rgba(255, 255, 255, 0.2)",
  },
  menuItem: {
    // Add any other styles you have for the menu item
    transition: "background-color 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "4px",
    height: "100%",
    backgroundColor: "red",
  },
}));

const Item = ({ title, to, icon, selected, setSelected }) => {
  const classes = useStyles();
  const handleClick = () => {
    setSelected(title);
  };
  const itemClassName = `${classes.menuItem} ${selected ? classes.active : ""}`;

  return (
    <MenuItem
      className={`${classes.menuItem} ${selected === title}`}
      // style={selected === title ? { color: "white" } : {}}
      onClick={handleClick}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <div style={{ position: "fixed", marginLeft: "170px" }}>{icon}</div>
        <Typography
          style={{ marginLeft: "40px" }}
          className={classes.Typography}
        >
          {title}
        </Typography>
        {/* {selected === title } */}
      </div>

      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ selectedMenuItem }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const handleSidebarItemClick = (menuItem) => {
    // Handle the menu item click logic here
  };

  const roleMenus = {
    الإدارة: [
      { title: "إحصائيات", to: "/الإدارة", icon: <StatsIcon /> },
      { title: "المُستخدمين", to: "/الإدارة/المُستخدمين", icon: <UsersIcon /> },
      { title: "السائقين", to: "/الإدارة/السائقين", icon: <DriversIcon /> },
      { title: "الحافلات", to: "/الإدارة/الحافلات", icon: <BusesIcon /> },
      { title: "الشكاوي", to: "/الإدارة/الشكاوي", icon: <ComplaintIcon /> },
    ],
    السفر: [
      { title: "الطلبات", to: "/السفر", icon: <RequestsIcon /> },
      { title: "رحلات السفر", to: "/السفر/الرحلات", icon: <TripsIcon /> },
      { title: "  أرشيف", to: "/السفر/الأرشيف", icon: <ArchiveIcon /> },
    ],
    الجامعات: [
      { title: "الرحلات ", to: "/الجامعات", icon: <RequestsIcon /> },
      {
        title: "طلبات الاشتراك",
        to: "/الجامعات/طلبات_الاشتراك",
        icon: <TripsIcon />,
      },
      {
        title: "أرشيف الرحلات",
        to: "/الجامعات/أرشيف_الجامعات",
        icon: <ArchiveIcon />,
      },
    ],
    الشحن: [
      { title: "رحلات الشحن", to: "/الشحن", icon: <RequestsIcon /> },
      { title: "طلبات الشحن", to: "/الشحن/طلبات_الشحن", icon: <TripsIcon /> },
      { title: "أرشيف الشحن", to: "/الشحن/أرشيف_الشحن", icon: <ArchiveIcon /> },
      { title: "الشاحنات ", to: "/الشحن/الشاحنات", icon: <BusesIcon /> },
    ],
  };

  const selectedRoleMenuItems = roleMenus[selectedMenuItem] || [];

  const handleLogout = () => {
    logout()
      .then(() => {
        localStorageServices.deleteToken();
        localStorageServices.deleteUser();
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box>
      <ProSidebar className={classes.sidebar}>
        <SidebarHeader className={classes.sidebarHeader}>
          <div>
            <img src={logo} alt="Logo" className={classes.logo} />
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", fontSize: 20, marginLeft: "auto" }}
              className={classes.Typography}
            >
              شركة الإتحاد العربي
            </Typography>
          </div>
        </SidebarHeader>

        <Menu>
          {selectedRoleMenuItems.map((menuItem) => (
            <Item
              key={menuItem.title}
              title={menuItem.title}
              to={`/dashboard${menuItem.to}`}
              icon={menuItem.icon}
              selected={selectedMenuItem === menuItem.title}
              setSelected={handleSidebarItemClick}
            />
          ))}
        </Menu>
        <Button onClick={handleLogout} style={{color:"antiquewhite"}}><Typography> Logout</Typography>
         </Button>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
