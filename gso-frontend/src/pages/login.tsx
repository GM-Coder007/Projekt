import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAPIEndpoint } from "../variables";

const LoginPage: React.FC = () => {
  const [error, setError] = useState("");

  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginInfo = {
      email: data.get("email"),
      password: data.get("password"),
    };

    fetch(getAPIEndpoint() + "/users/login?setCookie=true&react=true", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    }).then(async (res) => {
      const isJson = res.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await res.json() : null;

      if (res.ok) {
        navigate("/");
      } else {
        const error = (data && data.msg) || res.status;
        setError(error);
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {error && (
            <Alert sx={{ mt: 2 }} severity="error">
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Link to="/register" style={{ color: theme.palette.primary.main }}>
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
