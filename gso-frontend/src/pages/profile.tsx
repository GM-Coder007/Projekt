import { Avatar, Card, CardHeader, Container, Grid } from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { getAPIEndpoint } from "../variables";

const ProfilePage: React.FC = () => {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /*
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginInfo = {
      email: data.get("email"),
      password: data.get("password"),
    };

    fetch(getAPIEndpoint() + "/users/login", {
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
        const error = (data && data.message) || res.status;
        setError(error);
      }
    });
  };*/

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
        <Grid item xs={3}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  R
                </Avatar>
              }
              title="Shrimp and Chorizo Paella"
              subheader="September 14, 2016"
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ProfilePage;
