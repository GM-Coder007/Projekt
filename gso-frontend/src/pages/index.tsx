import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import Drive from "../components/drive";
import Header from "../components/header";

interface IDrive {
  _id: string;
  start: any;
  end: any;
  averageSpeed?: number;
  maxSpeed?: number;
  createdAt: string;
}

const FrontPage: React.FC = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [drives, setDrives] = useState<IDrive[]>([]);

  const refreshDrives = () => {
    fetch("http://localhost:4000/drives")
      .then((res) => res.json())
      .then((result) => {
        setIsLoaded(true);
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
        <Header logged_in={true} />

        <MapContainer
          center={[46.55917562552739, 15.638073505305133]}
          zoom={10}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline
            pathOptions={{ color: "lime" }}
            positions={[
              drives[0].start.coordinates,
              //[46.55654268154934, 15.645938299807277],
              drives[0].end.coordinates,
            ]}
          />
        </MapContainer>
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
