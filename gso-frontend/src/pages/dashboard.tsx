import { Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Drive, { IDrive } from "../components/drive";
import Header from "../components/header";
import QualityMap, { ISection } from "../components/qualityMap";
import { getAPIEndpoint } from "../variables";

const DashboardPage: React.FC = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [drives, setDrives] = useState<IDrive[]>([]);
  const [sections, setSections] = useState<ISection[]>([]);
  const navigate = useNavigate();

  function refreshRoadQuality(id: string) {
    fetch(getAPIEndpoint() + "/roadquality/" + id, { credentials: "include" })
      .then((res) => res.json())
      .then((result) => {
        let section: ISection[] = [];
        if (result.length > 0) {
          result.forEach((roadquality: any) => {
            section.push({
              start: roadquality.start.coordinates,
              end: roadquality.end.coordinates,
              quality: roadquality.quality,
            });
          });
          setSections(section);
        } else {
          setSections([]);
        }
      });
  }

  function refreshDrives() {
    fetch(getAPIEndpoint() + "/drives", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
        }
        return res.json();
      })
      .then((result) => {
        setIsLoaded(true);
        if (result.length > 0) {
          refreshRoadQuality(result[0]._id);
          setDrives(result);
        } else {
          setDrives([]);
        }
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  }

  useEffect(() => {
    refreshDrives();
  }, []);

  async function handleDelete(id: string) {
    await fetch(getAPIEndpoint() + "/drives/" + id, {
      method: "DELETE",
      credentials: "include",
    });
    refreshDrives();
  }

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
            <Drive
              key={drive._id}
              drive={drive}
              refreshRoadQuality={refreshRoadQuality}
              handleDelete={handleDelete}
            />
          ))}
        </Container>
      </>
    );
  }
};

export default DashboardPage;
