import { Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import QualityMap, { ISection } from "../components/qualityMap";
import Roadworks from "../components/roadworks";
import { getAPIEndpoint } from "../variables";

const FrontPage: React.FC = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sections, setSections] = useState<ISection[]>([]);

  const refreshDrives = () => {
    fetch(getAPIEndpoint() + "/roadquality")
      .then((res) => res.json())
      .then((result) => {
        setIsLoaded(true);
        let section: ISection[] = [];

        result.forEach((drive: any) => {
          section.push({
            start: drive.start.coordinates,
            end: drive.end.coordinates,
            quality: drive.quality,
          });
        });
        setSections(section);
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  };

  useEffect(() => {
    refreshDrives();
  }, []);

  if (error) {
    return <div>Error loading</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Header />

        <Container>
          <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            Road conditions
          </Typography>

          <QualityMap sections={sections} />

          <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            Traffic information
          </Typography>
          <Roadworks />
        </Container>
      </>
    );
  }
};

export default FrontPage;
/*
<Grid container direction="column" alignItems="center">
          {drives.map((drive) => (
            <Drive
              id={drive._id}
              averageSpeed={drive.averageSpeed}
              maxSpeed={drive.maxSpeed}
              createdAt={drive.createdAt}
              key={drive._id}
            />
          ))}
        </Grid>
*/
