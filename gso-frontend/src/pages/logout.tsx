import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAPIEndpoint } from "../variables";

const LogoutPage: React.FC = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch(getAPIEndpoint() + "/users/logout", {
      credentials: "include",
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
  }, []);

  return { error } ? (
    <Typography variant="body1">{error}</Typography>
  ) : (
    <Typography variant="body1">You have been logged out</Typography>
  );
};

export default LogoutPage;
