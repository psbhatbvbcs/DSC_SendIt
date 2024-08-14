import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";

import { Browsers, CaretLeft, CaretRight, House } from "@phosphor-icons/react";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = [
  {
    text: "Dashboard",
    navigateTo: "dashboard",
    icon: <House />,
  },
  {
    text: "Post some new content!",
    icon: null,
  },
  {
    text: "Manage Posts",
    navigateTo: "posts",
    icon: <Browsers />,
  },
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, []);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              boxSizing: "border-box",
              position: "fixed",
              bgcolor: "#CDF5FD",
              width: drawerWidth,
              height: "100vh",
            },
          }}
        >
          <Box
            className="sidebar-background"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              opacity: 0.2,
              zIndex: -1,
            }}
          />
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 2rem">
              <FlexBetween>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography
                    fontFamily="Space Grotesk"
                    variant="h3"
                    fontWeight={"bold"}
                    color="blue"
                  >
                    DSC
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <CaretLeft color="blue" />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, navigateTo, icon }, index) => {
                if (!icon) {
                  return (
                    <Typography
                      fontFamily="Space Grotesk"
                      variant="body1"
                      key={text}
                      sx={{
                        m: "2.25rem 0 1rem 2rem",
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                      color="blue"
                    >
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();
                const navigateToPath = navigateTo.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${navigateToPath}`);
                        setActive(lcText);
                        !isNonMobile && setIsSidebarOpen(false);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                        //borderBottom: "1px solid #7D8589",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          fontFamily="Space Grotesk"
                          variant="body2"
                          sx={{
                            color:
                              active === lcText
                                ? "rgb(0, 0, 0, 0.50)"
                                : "#7D8589",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {text}
                        </Typography>
                      </ListItemText>
                      {active === lcText && <CaretRight sx={{ ml: "auto" }} />}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
