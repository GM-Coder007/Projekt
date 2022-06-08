import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  Grid,
  TextField,
} from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { getAPIEndpoint } from "../variables";

interface IProfile {
  _id: string;
  email: string;
  twofa: boolean;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<IProfile>();
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  function refreshProfile() {
    fetch(getAPIEndpoint() + "/users/profile", { credentials: "include" }).then(
      async (res) => {
        const isJson = res.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await res.json() : null;

        if (res.ok) {
          setProfile(data);
          setChecked(data.twofa);
        } else {
          const error = (data && data.message) || res.status;
          setError(error);
        }
      }
    );
  }

  useEffect(() => {
    refreshProfile();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("password") !== data.get("password2")) {
      setError("Passwords do not match");
      return;
    }

    const password = data.get("password");

    const profileInfo =
      password === ""
        ? { twofa: checked }
        : {
            password,
            twofa: checked,
          };

    fetch(getAPIEndpoint() + "/users/profile", {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileInfo),
    }).then(async (res) => {
      const isJson = res.headers
        .get("content-type")
        ?.includes("application/json");
      const dataj = isJson ? await res.json() : null;

      if (res.ok) {
        navigate("/logout");
      } else {
        const error = (dataj && dataj.message) || res.status;
        setError(error);
      }
    });
  };

  const switchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Header />
      <Grid
        container
        spacing={0}
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "90vh" }}
      >
        <Grid item>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {profile?.email[0]}
                </Avatar>
              }
              title={profile?.email}
            />
            <CardContent component="form" onSubmit={handleSubmit} noValidate>
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Repeat password"
                type="password"
                id="password2"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Switch checked={checked} onChange={switchHandler} />}
                label="Enable 2FA"
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
                Save changes
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ProfilePage;
