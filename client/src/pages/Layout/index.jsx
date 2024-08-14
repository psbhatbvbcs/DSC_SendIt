import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Layout = () => {
  const isNonMobile = !useMediaQuery(
    "(max-width:600px) or (max-height:600px) or (orientation: portrait)"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    isNonMobile ? true : false
  );
  return (
    <Box
      display={isNonMobile ? "flex" : "block"}
      width={"100%"}
      height={"100%"}
    >
      {" "}
      <Box flexGrow={1}>
        <Navbar isSidebarOpen={isSidebarOpen} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
