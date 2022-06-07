import { Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Drive, { IDrive } from "../components/drive";
import Header from "../components/header";
import QualityMap, { ISection } from "../components/qualityMap";
import { getAPIEndpoint } from "../variables";

const DashboardPage: React.FC = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [drives, setDrives] = useState<IDrive[]>([]);
  const [sections, setSections] = useState<ISection[]>([]);

  const refreshDrives = () => {
    fetch(getAPIEndpoint() + "/drives")
      .then((res) => res.json())
      .then((result) => {
        setIsLoaded(true);
        let section: ISection[] = [];
        section.push({
          start: result[0].start.coordinates,
          end: result[0].end.coordinates,
          quality: 10,
        });
        setSections(section);
        setDrives(result);
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

        <Container sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            Road conditions
          </Typography>

          <QualityMap sections={sections} />

          <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            My trips
          </Typography>
          {drives.map((drive) => (
            <Drive key={drive._id} drive={drive} />
          ))}
        </Container>
      </>
    );
  }
};

export default DashboardPage;
