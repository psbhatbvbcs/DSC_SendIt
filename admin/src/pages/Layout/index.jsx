// inbuilt modules
import { Box, Divider, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";

// external modules
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const Layout = () => {
  // useState
  const isNonMobile = !useMediaQuery(
    "(max-width:600px) or (max-height:600px) or (orientation: portrait)"
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    isNonMobile ? true : false
  );

  // redux
  useEffect(() => {
    ("hi");
  }, []);

  return (
    <Box display="flex" width="100%" height="100%">
      <Sidebar
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Divider />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
