import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAPIEndpoint } from "../variables";

interface IRoadWorks {
  id: string;
  title: string;
  summary: string;
}

const Roadworks: React.FC = () => {
  const [roadworks, setRoadworks] = useState<IRoadWorks[]>([]);
  const [error, setError] = useState(null);

  function refreshTraffic() {
    fetch(getAPIEndpoint() + "/roadworks").then(async (res) => {
      const isJson = res.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await res.json() : null;

      if (res.ok) {
        if (data.roadworks && data.roadworks.length > 0)
          setRoadworks(data.roadworks);
      } else {
        const error = (data && data.message) || res.status;
        setError(error);
      }
    });
  }

  useEffect(() => {
    refreshTraffic();
  }, []);

  return (
    <>
      {error ? (
        <Card sx={{ mb: 2 }}>
          <CardHeader title="No content" />
          <CardContent>
            <Typography variant="body1" color="text.primary">
              Please refresh this page
            </Typography>
          </CardContent>
        </Card>
      ) : (
        roadworks.map((roadwork) => (
          <Card sx={{ mb: 2 }} key={roadwork.id}>
            <CardHeader title={roadwork.title} />
            <CardContent>
              <Typography variant="body1" color="text.primary">
                {roadwork.summary}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
};

export default Roadworks;
