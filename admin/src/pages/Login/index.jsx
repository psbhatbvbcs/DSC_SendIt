import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../../utils/axiosProvider";
import { toast } from "react-hot-toast";
import { toastEnd, toastStart } from "../../utils/customToaster";
import { useAuth } from "../../utils/authProvider";

const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    margin: "1rem",
    gap: theme.spacing(2),
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "48px",
  color: "#000336",
  fontWeight: "bold",
  margin: theme.spacing(1, 0, 1, 0),
  [theme.breakpoints.down("sm")]: {
    fontSize: "40px",
  },
}));

const CustomButton = ({
  backgroundColor,
  color,
  buttonIcon,
  buttonText,
  heroBtn,
  guideBtn,
  getStartedBtn,
  onClickFun,
  type,
}) => {
  const CustomStyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: backgroundColor,
    color: color,
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    padding: "0.5rem 1.25rem",
    borderRadius: "7px",
    textTransform: "none",
    display: "flex", // Display as flex to align icon and text horizontally
    alignItems: "center", // Align icon and text vertically within the button
    gap: theme.spacing(1), // Add some gap between icon and text
    border: "2px solid transparent",
    width: "90%",
    "&:hover": {
      backgroundColor: color,
      color: backgroundColor,
      borderColor: backgroundColor,
    },
    [theme.breakpoints.down("md")]: {
      margin: (heroBtn || guideBtn) && theme.spacing(0, "auto", 3, "auto"),
      width: (heroBtn || guideBtn) && "90%",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: guideBtn && theme.spacing(3),
      width: guideBtn && "90%",
    },
  }));

  return (
    <CustomStyledButton onClick={onClickFun} type={type}>
      {buttonIcon}
      {buttonText}
    </CustomStyledButton>
  );
};

const TextFieldWrapper = ({ customSx, ...props }) => {
  const defaultSx = {
    paddingLeft: "10px",
    backgroundColor: "#E6F0FF",
    height: "50px",
    borderRadius: "20px",
    "& .MuiInputLabel-root": {
      background: "transparent",
      color: "grey",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "grey", // Change the focused label color as needed
    },
    "& .MuiFilledInput-underline": {
      "&:before, &:after, &:hover:before, &:hover:after, &:focus:before, &:focus:after, &:active:before, &:active:after,":
        {
          borderBottom: "none", // Remove the underline
          color: "black",
        },
    },
    "& .MuiFilledInput-input": {
      borderRadius: "30px",
    },
    "& .MuiFilledInput-root": {
      background: "transparent",
      color: "black",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "black",
    },
  };

  return <TextField sx={{ ...defaultSx, ...customSx }} {...props} />;
};

const initialValues = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    document.title = "DSC ADMIN | Login";
  }, []);

  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please fill in all fields");
      return;
    }
    handleLogin();
  };

  const handleLogin = async () => {
    // Remove 'e' from the parameter list
    toastStart("Logging in...");
    try {
      const { data } = await api.post(
        `/auth/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      localStorage.setItem("user", JSON.stringify(data.user));
      toastEnd();
      navigate("/dashboard");
      toast.success(data.message);
    } catch (error) {
      toastEnd();
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error(
          "Network Error. The backend server is offline. Contact the admins or try again later."
        );
      } else {
        toast.error("Unknown Error. Contact the admins or try again later.");
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#E6F0FF",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <CustomBox>
        <Title>Log in</Title>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            alignItems: "center",
            justifyContent: "center",
            width: "95%",
            maxWidth: "400px",
            backgroundColor: "#F5FAFE",
            borderRadius: "10px",
            height: "auto",
            padding: "20px",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <TextFieldWrapper
            label="Email"
            type="email"
            variant="filled"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <TextFieldWrapper
            label="Password"
            type={passwordVisible ? "text" : "password"}
            variant="filled"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <CustomButton
            backgroundColor="#0F1B4C"
            color="#fff"
            buttonText="Log In"
            heroBtn={true}
            type="submit"
          />
        </Box>
      </CustomBox>
    </Box>
  );
};

export default LoginPage;
