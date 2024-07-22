import React, { useState } from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FlightIcon from "@mui/icons-material/Flight";
import ArchiveIcon from "@mui/icons-material/Archive";
import SchoolIcon from "@mui/icons-material/School";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const useStyles = makeStyles((theme) => ({
  leftsidebar: {
    width: 80,
    height: 300,
    position: "fixed",
    top: "50%",
    left: "5%",
    transform: "translateY(-50%)",
    borderRight: "24px solid #282828",
    borderRadius: "20px",
    background: "#282828",
    zIndex: "999",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    padding: theme.spacing(1, 2),
    color: "#ffffff",
    marginLeft: "20px",
    flex: 1,
  },
  icon: {
    fontSize: "20px",
  },
  title: {
    fontSize: "13px",
  },
  active: {
    backgroundColor: "#F01E29",
    transition: "background-color 0.3s",

    borderRadius: "10px",
  },
}));

const LeftSidebar = ({ handleSidebarItemClick }) => {
  const classes = useStyles();
  const [selectedRole, setSelectedRole] = useState(null);
  const roleMenus = {
    الإدارة: { icon: <HomeIcon /> },
    السفر: { icon: <FlightIcon /> },
    // الأمانات: { icon: <ArchiveIcon /> },
    الجامعات: { icon: <SchoolIcon /> },
    الشحن: { icon: <LocalShippingIcon /> },
  };

  const handleMenuItemClick = (role) => {
    setSelectedRole(role);
    handleSidebarItemClick(role);
  };
  return (
    <Box>
      <div className={classes.leftsidebar}>
        {Object.entries(roleMenus).map(([role, menu]) => (
          <Link
            to={`/dashboard/${role}`}
            className={`${classes.menuItem} ${
              selectedRole === role ? classes.active : ""
            }`}
            key={role}
            onClick={() => handleMenuItemClick(role)}
          >
            <div className={classes.icon}>{menu.icon}</div>
            <Typography className={classes.title}>{role}</Typography>
          </Link>
        ))}
      </div>
    </Box>
  );
};

export default LeftSidebar;
