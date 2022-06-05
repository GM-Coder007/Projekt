import { Grid } from "@mui/material";
import { Point } from "geojson";
import React, { useEffect, useState } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import Drive from "../components/drive";

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
    fetch("http://localhost:4000/data/drives")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setDrives(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
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
        <MapContainer
          center={[46.55031007765001, 15.638652076533498]}
          zoom={13}
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
