import { Grid } from "@mui/material";
import { Point } from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import Drive from "../components/drive";

interface IDrive {
  _id: string;
  start: Point;
  end: Point;
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
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <Polyline
          pathOptions={{ color: "lime" }}
          positions={[
            [46.55031007765001, 15.638652076533498],
            [46.55901615879933, 15.638394273160692],
          ]}
        />
      </MapContainer>
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
