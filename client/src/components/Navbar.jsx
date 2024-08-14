import { Box } from "@mui/material";
import React from "react";
import logo from "../assets/cropped.png";

const Navbar = () => {
  return (
    <Box width="100vw" bgcolor="wheat">
      <img
        src={logo}
        alt="logo"
        width="60px"
        style={{
          borderRadius: "15px",
          position: "absolute",
          right: "20px",
          top: "20px",
        }}
      />
    </Box>
  );
};

export default Navbar;
