import React, { useMemo, useState } from "react";
import FlexBetween from "../components/FlexBetween";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import { api } from "../utils/axiosProvider";
import { useAuth } from "../utils/authProvider";
import { toastEnd, toastStart } from "../utils/customToaster";
import {
  ArrowFatDown,
  CaretDoubleDown,
  CaretDown,
  Gear,
  List,
} from "@phosphor-icons/react";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const isAuthenticated = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);

  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const openProfileMenu = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setProfileMenuAnchorEl(null);
  };

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    toastStart("Logging Out...");
    try {
      await api.get(`/v01/users/logout`, {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      setAnchorEl(null);
      navigate("/landing");
      toastEnd();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error(
          "Network Error. The backend server is offline. Contact the admins or try again later."
        );
      } else {
        toast.error("Unknown Error. Contact the admins or try again later.");
      }
      toastEnd();
    }
  };

  return (
    <AppBar
      sx={{
        backgroundColor: "#CDF5FD",
        position: "relative", // Required for positioning the ::before pseudo-element
        "&::before": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2, // Adjust the opacity value as needed
          zIndex: -1, // Move the pseudo-element below other content
        },
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <List />
          </IconButton>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={openProfileMenu}>
            <Gear sx={{ fontSize: "25px" }} />
          </IconButton>

          {!isAuthenticated ? (
            // User is not logged in
            <div>
              <Button
                variant="contained"
                sx={{
                  color: "#f0f0f0",
                  backgroundColor: "#cca752",
                  fontSize: "1rem",
                  width: "120px", // Set a fixed width for the button
                  "@media (max-width: 600px)": {
                    // Apply different styles for mobile screens
                    width: "100%", // Full width on mobile screens
                    fontSize: "0.9rem", // Adjust font size for mobile
                  },
                }}
                component={Link}
                to="/login"
              >
                Log In
              </Button>
            </div>
          ) : (
            // User is logged in
            <FlexBetween>
              {/* Wrap IconButton with a div and use the div as the anchor element */}
              <div>
                <IconButton
                  className="hey"
                  onClick={handleClick}
                  sx={{
                    borderRadius: "20px",
                    bgcolor: "#f0f0f0",
                    gap: "5px",
                  }}
                >
                  <Avatar
                    alt="profile"
                    sx={{
                      height: "40px",
                      width: "40px",
                    }}
                  />
                  <Box textAlign={"left"}>
                    <Typography
                      fontWeight={"bold"}
                      fontSize={"0.85rem"}
                      sx={{
                        color: "#cca752",
                      }}
                    >
                      {user.name}
                    </Typography>
                  </Box>
                  <CaretDown
                    sx={{
                      color: "#cca752",
                      fontSize: "25px",
                    }}
                  />
                </IconButton>

                {/* ... your existing code ... */}
                <Menu
                  anchorEl={anchorEl}
                  open={isOpen}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                </Menu>
                <Menu
                  anchorEl={profileMenuAnchorEl}
                  open={Boolean(profileMenuAnchorEl)}
                  onClose={closeProfileMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/my-profile");
                      setProfileMenuAnchorEl(null);
                    }}
                  >
                    User Profile
                  </MenuItem>
                </Menu>
              </div>
            </FlexBetween>
          )}
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
